package com.expense.management.service;

import com.expense.management.exception.BadRequestException;
import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.exception.UnauthorizedException;
import com.expense.management.model.dto.request.TransactionRequest;
import com.expense.management.model.dto.response.TransactionResponse;
import com.expense.management.model.entity.Category;
import com.expense.management.model.entity.Profile;
import com.expense.management.model.entity.Transaction;
import com.expense.management.repository.CategoryRepository;
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
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ProfileRepository profileRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        Profile user = getProfile(userId);
        Category category = getCategory(request.getCategoryId());

        // Validate transaction type matches category type
        if (!request.getType().name().equals(category.getType().name())) {
            throw new BadRequestException("Transaction type must match category type");
        }

        Transaction transaction = Transaction.builder()
                .user(user)
                .category(category)
                .amount(request.getAmount())
                .type(request.getType())
                .transactionDate(request.getTransactionDate())
                .note(request.getNote())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionRequest request) {
        Transaction transaction = getTransaction(transactionId);

        // Verify ownership
        if (!transaction.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to update this transaction");
        }

        Category category = getCategory(request.getCategoryId());

        // Validate transaction type matches category type
        if (!request.getType().name().equals(category.getType().name())) {
            throw new BadRequestException("Transaction type must match category type");
        }

        transaction.setCategory(category);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNote(request.getNote());

        Transaction updated = transactionRepository.save(transaction);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = getTransaction(transactionId);

        // Verify ownership
        if (!transaction.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactions(Long userId, Pageable pageable) {
        Profile user = getProfile(userId);
        return transactionRepository.findByUser(user, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long userId, Long transactionId) {
        Transaction transaction = getTransaction(transactionId);

        // Verify ownership
        if (!transaction.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to view this transaction");
        }

        return mapToResponse(transaction);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStatistics(Long userId, Integer month, Integer year) {
        Profile user = getProfile(userId);

        BigDecimal totalIncome = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                user, Transaction.TransactionType.INCOME, month, year);

        BigDecimal totalExpense = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                user, Transaction.TransactionType.EXPENSE, month, year);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalIncome", totalIncome);
        stats.put("totalExpense", totalExpense);
        stats.put("balance", balance);
        stats.put("month", month);
        stats.put("year", year);

        return stats;
    }

    // New methods for Phase 1 dashboard features
    @Transactional(readOnly = true)
    public Map<String, Object> getTrendData(Long userId, Integer month, Integer year) {
        Profile user = getProfile(userId);

        // Get current month stats
        Map<String, Object> currentStats = getStatistics(userId, month, year);
        BigDecimal currentIncome = (BigDecimal) currentStats.get("totalIncome");
        BigDecimal currentExpense = (BigDecimal) currentStats.get("totalExpense");
        BigDecimal currentBalance = (BigDecimal) currentStats.get("balance");

        // Get previous month stats
        LocalDate currentDate = LocalDate.of(year, month, 1);
        LocalDate previousDate = currentDate.minusMonths(1);
        Map<String, Object> previousStats = getStatistics(
                userId,
                previousDate.getMonthValue(),
                previousDate.getYear());
        BigDecimal previousIncome = (BigDecimal) previousStats.get("totalIncome");
        BigDecimal previousExpense = (BigDecimal) previousStats.get("totalExpense");
        BigDecimal previousBalance = (BigDecimal) previousStats.get("balance");

        // Get sparkline data (4 weeks)
        java.util.List<BigDecimal> incomeSparkline = getWeeklyData(user, month, year,
                Transaction.TransactionType.INCOME);
        java.util.List<BigDecimal> expenseSparkline = getWeeklyData(user, month, year,
                Transaction.TransactionType.EXPENSE);

        // Calculate balance sparkline
        java.util.List<BigDecimal> balanceSparkline = new java.util.ArrayList<>();
        for (int i = 0; i < incomeSparkline.size(); i++) {
            BigDecimal weekBalance = incomeSparkline.get(i).subtract(expenseSparkline.get(i));
            balanceSparkline.add(weekBalance);
        }

        // Build response
        Map<String, Object> result = new HashMap<>();
        result.put("income", buildTrendObject(
                currentIncome, previousIncome, incomeSparkline, "up"));
        result.put("expense", buildTrendObject(
                currentExpense, previousExpense, expenseSparkline, "up"));
        result.put("balance", buildTrendObject(
                currentBalance, previousBalance, balanceSparkline, "up"));

        return result;
    }

    @Transactional(readOnly = true)
    public java.util.List<TransactionResponse> getRecentTransactions(Long userId, Integer limit) {
        Profile user = getProfile(userId);
        Pageable pageable = org.springframework.data.domain.PageRequest.of(
                0, limit,
                org.springframework.data.domain.Sort.by("transactionDate").descending());

        Page<Transaction> transactions = transactionRepository.findRecentByUser(user, pageable);
        return transactions.getContent().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    // Helper methods for trend data
    private java.util.List<BigDecimal> getWeeklyData(
            Profile user, Integer month, Integer year, Transaction.TransactionType type) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());
        java.util.List<BigDecimal> weeklyData = new java.util.ArrayList<>();

        // Divide month into 4 weeks
        int daysInMonth = startOfMonth.lengthOfMonth();
        int daysPerWeek = daysInMonth / 4;

        for (int week = 0; week < 4; week++) {
            LocalDate weekStart = startOfMonth.plusDays(week * daysPerWeek);
            LocalDate weekEnd = (week == 3) ? endOfMonth : weekStart.plusDays(daysPerWeek - 1);

            BigDecimal weeklySum = transactionRepository.sumByUserAndTypeAndDateRange(
                    user, type, weekStart, weekEnd);
            weeklyData.add(weeklySum != null ? weeklySum : BigDecimal.ZERO);
        }

        return weeklyData;
    }

    private Map<String, Object> buildTrendObject(
            BigDecimal current, BigDecimal previous,
            java.util.List<BigDecimal> sparklineData, String trendDirection) {
        double percentageChange = calculatePercentageChange(previous, current);
        String trend = percentageChange >= 0 ? "up" : "down";

        Map<String, Object> trendObject = new HashMap<>();
        trendObject.put("current", current);
        trendObject.put("previous", previous);
        trendObject.put("percentageChange", Math.abs(percentageChange));
        trendObject.put("trend", trend);
        trendObject.put("sparklineData", sparklineData);

        return trendObject;
    }

    private double calculatePercentageChange(BigDecimal previous, BigDecimal current) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private Profile getProfile(Long userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private Transaction getTransaction(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .categoryId(transaction.getCategory().getId())
                .categoryName(transaction.getCategory().getName())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .transactionDate(transaction.getTransactionDate())
                .note(transaction.getNote())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
