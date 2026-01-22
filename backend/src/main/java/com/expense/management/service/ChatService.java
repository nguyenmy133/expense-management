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

    private final GeminiService geminiService;

    @Transactional
    public ChatResponse chat(Long userId, ChatRequest request) {
        Profile user = getProfile(userId);

        // Build context from user's financial data
        String context = buildFinancialContext(user);

        // Generate AI response via Gemini
        String fullPrompt = "Bạn là một trợ lý tài chính cá nhân thông minh, thân thiện. " +
                "Dưới đây là dữ liệu tài chính hiện tại của người dùng:\n" + context + "\n\n" +
                "Người dùng hỏi: \"" + request.getMessage() + "\"\n" +
                "Hãy trả lời người dùng dựa trên dữ liệu trên. Nếu câu hỏi không liên quan đến tài chính, hãy trả lời bình thường. "
                +
                "Trả lời bằng tiếng Việt, ngắn gọn, súc tích và có tính khuyên nhủ.";

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
