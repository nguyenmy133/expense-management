package com.expense.management.service;

import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.model.dto.request.ChatRequest;
import com.expense.management.model.dto.response.ChatResponse;
import com.expense.management.model.entity.ChatHistory;
import com.expense.management.model.entity.Profile;
import com.expense.management.model.entity.Transaction;
import com.expense.management.repository.ChatHistoryRepository;
import com.expense.management.repository.ProfileRepository;
import com.expense.management.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

        private final ChatHistoryRepository chatHistoryRepository;
        private final ProfileRepository profileRepository;
        private final TransactionRepository transactionRepository;

        private final GeminiService geminiService;

        @Transactional
        public ChatResponse chat(Long userId, ChatRequest request) {
                Profile user = getProfile(userId);

                // Build context from user's financial data
                String context = buildFinancialContext(user);

                // Generate AI response via Gemini
                String fullPrompt = "Bạn là một trợ lý AI thông minh, người bạn đồng hành tin cậy. " +
                                "Bạn có quyền truy cập vào dữ liệu tài chính của người dùng để hỗ trợ khi cần thiết, " +
                                "nhưng bạn cũng có thể trò chuyện về mọi chủ đề khác trong cuộc sống (kiến thức, lời khuyên, giải trí...).\n\n"
                                +
                                "Dưới đây là dữ liệu tài chính của người dùng (bao gồm tổng quan và chi tiết từng giao dịch):\n"
                                + context + "\n\n" +
                                "Người dùng hỏi: \"" + request.getMessage() + "\"\n" +
                                "Hướng dẫn trả lời:\n" +
                                "1. Nếu câu hỏi liên quan đến tài chính: Hãy phân tích kỹ dữ liệu trên để đưa ra câu trả lời chính xác, hữu ích. "
                                +
                                "Nếu người dùng hỏi về ngày cụ thể (ví dụ: hôm nay, hôm qua), hãy lọc trong danh sách giao dịch chi tiết để trả lời. "
                                +
                                "Hãy đưa ra lời khuyên nếu thấy cần thiết.\n"
                                +
                                "2. Nếu câu hỏi KHÔNG liên quan đến tài chính: Hãy trả lời như một người bạn thông thái, thân thiện. "
                                +
                                "Đừng từ chối trả lời chỉ vì bạn là trợ lý tài chính. " +
                                "Với những câu hỏi về thông tin thời gian thực (thời tiết, tỷ giá mới nhất...) mà bạn không biết, "
                                +
                                "hãy nói rõ là bạn không có dữ liệu thời gian thực nhưng vẫn cố gắng hỗ trợ thông tin chung hoặc đưa ra gợi ý hữu ích.\n"
                                +
                                "Trả lời bằng tiếng Việt, ngắn gọn, súc tích và tự nhiên.";

                String aiResponse = geminiService.generateContent(fullPrompt);

                // Save chat history
                ChatHistory chatHistory = ChatHistory.builder()
                                .user(user)
                                .message(request.getMessage())
                                .response(aiResponse)
                                .build();

                ChatHistory saved = chatHistoryRepository.save(chatHistory);

                return mapToResponse(saved);
        }

        @Transactional(readOnly = true)
        public Page<ChatResponse> getChatHistory(Long userId, Pageable pageable) {
                Profile user = getProfile(userId);
                return chatHistoryRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                                .map(this::mapToResponse);
        }

        @Transactional
        public void clearChatHistory(Long userId) {
                Profile user = getProfile(userId);
                chatHistoryRepository.deleteByUser(user);
        }

        private String buildFinancialContext(Profile user) {
                LocalDate now = LocalDate.now();
                int currentMonth = now.getMonthValue();
                int currentYear = now.getYear();
                LocalDate startDate = now.withDayOfMonth(1);
                LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());

                // 1. Get Monthly Summary (as before)
                BigDecimal monthlyIncome = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                                user, Transaction.TransactionType.INCOME, currentMonth, currentYear);
                BigDecimal monthlyExpense = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                                user, Transaction.TransactionType.EXPENSE, currentMonth, currentYear);

                if (monthlyIncome == null)
                        monthlyIncome = BigDecimal.ZERO;
                if (monthlyExpense == null)
                        monthlyExpense = BigDecimal.ZERO;

                // 2. Get Detailed Transactions for current month
                List<Transaction> transactions = transactionRepository
                                .findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
                                                user, startDate, endDate);

                StringBuilder sb = new StringBuilder();
                sb.append(String.format("=== FINANCIAL REPORT %d/%d ===\n", currentMonth, currentYear));
                sb.append(String.format("Today is: %s\n", now));
                sb.append(String.format("Total Income: %s VND\n", monthlyIncome));
                sb.append(String.format("Total Expense: %s VND\n", monthlyExpense));
                sb.append(String.format("Balance: %s VND\n", monthlyIncome.subtract(monthlyExpense)));

                sb.append("\n=== DETAILED TRANSACTIONS (Recent first) ===\n");
                if (transactions.isEmpty()) {
                        sb.append("(No transactions recorded this month)\n");
                } else {
                        // Limit to last 100 to avoid token limits if necessary, though Gemini has large
                        // context
                        int count = 0;
                        for (Transaction t : transactions) {
                                if (count++ > 200)
                                        break; // Safety limit
                                sb.append(String.format(
                                                "- Date: %s | Type: %s | Category: %s | Amount: %s | Note: %s\n",
                                                t.getTransactionDate(),
                                                t.getType(),
                                                t.getCategory().getName(),
                                                t.getAmount(),
                                                t.getNote() != null ? t.getNote() : ""));
                        }
                }
                sb.append("============================================\n");

                return sb.toString();
        }

        private Profile getProfile(Long userId) {
                return profileRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }

        private ChatResponse mapToResponse(ChatHistory chatHistory) {
                return ChatResponse.builder()
                                .id(chatHistory.getId())
                                .message(chatHistory.getMessage())
                                .response(chatHistory.getResponse())
                                .createdAt(chatHistory.getCreatedAt())
                                .build();
        }
}
