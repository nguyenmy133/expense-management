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

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final ProfileRepository profileRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public ChatResponse chat(Long userId, ChatRequest request) {
        Profile user = getProfile(userId);

        // Build context from user's financial data
        String context = buildFinancialContext(user);

        // Generate AI response (simplified version - no actual OpenAI call)
        String aiResponse = generateResponse(request.getMessage(), context);

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

        BigDecimal monthlyIncome = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                user, Transaction.TransactionType.INCOME, currentMonth, currentYear);

        BigDecimal monthlyExpense = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                user, Transaction.TransactionType.EXPENSE, currentMonth, currentYear);

        return String.format(
                "User's financial summary for %d/%d: Income: %s VND, Expense: %s VND, Balance: %s VND",
                currentMonth, currentYear,
                monthlyIncome, monthlyExpense,
                monthlyIncome.subtract(monthlyExpense));
    }

    private String generateResponse(String message, String context) {
        // Simplified AI response - In production, this would call OpenAI API
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("chi tiêu") || lowerMessage.contains("expense")) {
            return "Dựa trên dữ liệu của bạn, tôi thấy bạn nên cân nhắc giảm chi tiêu ở một số danh mục không cần thiết. "
                    +
                    "Hãy xem lại các khoản chi cho ăn uống và giải trí nhé!";
        } else if (lowerMessage.contains("tiết kiệm") || lowerMessage.contains("save")) {
            return "Để tiết kiệm hiệu quả, bạn nên:\n" +
                    "1. Lập ngân sách cho từng danh mục\n" +
                    "2. Theo dõi chi tiêu hàng ngày\n" +
                    "3. Cắt giảm các khoản chi không cần thiết\n" +
                    "4. Đặt mục tiêu tiết kiệm cụ thể";
        } else if (lowerMessage.contains("ngân sách") || lowerMessage.contains("budget")) {
            return "Tôi khuyên bạn nên phân bổ ngân sách theo quy tắc 50/30/20:\n" +
                    "- 50% cho nhu cầu thiết yếu\n" +
                    "- 30% cho mong muốn cá nhân\n" +
                    "- 20% cho tiết kiệm và đầu tư";
        } else {
            return "Tôi là trợ lý tài chính AI. Tôi có thể giúp bạn:\n" +
                    "- Phân tích chi tiêu\n" +
                    "- Đưa ra lời khuyên tiết kiệm\n" +
                    "- Tư vấn về ngân sách\n" +
                    "Hãy hỏi tôi về chi tiêu, tiết kiệm hoặc ngân sách của bạn!";
        }
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
