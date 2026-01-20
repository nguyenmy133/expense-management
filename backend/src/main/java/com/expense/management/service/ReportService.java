package com.expense.management.service;

import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.model.dto.response.MonthlyReportResponse;
import com.expense.management.model.entity.Category;
import com.expense.management.model.entity.Profile;
import com.expense.management.model.entity.Transaction;
import com.expense.management.repository.CategoryRepository;
import com.expense.management.repository.ProfileRepository;
import com.expense.management.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final ProfileRepository profileRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public MonthlyReportResponse getMonthlyReport(Long userId, Integer month, Integer year) {
        Profile user = getProfile(userId);

        BigDecimal totalIncome = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                user, Transaction.TransactionType.INCOME, month, year);

        BigDecimal totalExpense = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                user, Transaction.TransactionType.EXPENSE, month, year);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        // Get category breakdown for expenses
        List<MonthlyReportResponse.CategorySummary> categoryBreakdown = new ArrayList<>();
        List<Category> expenseCategories = categoryRepository.findByType(Category.CategoryType.EXPENSE);

        for (Category category : expenseCategories) {
            BigDecimal categoryAmount = transactionRepository.sumByUserAndCategoryAndMonthAndYear(
                    user, Transaction.TransactionType.EXPENSE, category.getId(), month, year);

            if (categoryAmount.compareTo(BigDecimal.ZERO) > 0) {
                Double percentage = totalExpense.compareTo(BigDecimal.ZERO) > 0
                        ? categoryAmount.divide(totalExpense, 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100)).doubleValue()
                        : 0.0;

                categoryBreakdown.add(MonthlyReportResponse.CategorySummary.builder()
                        .categoryId(category.getId())
                        .categoryName(category.getName())
                        .categoryIcon(category.getIcon())
                        .amount(categoryAmount)
                        .percentage(percentage)
                        .build());
            }
        }

        // Sort by amount descending
        categoryBreakdown.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));

        return MonthlyReportResponse.builder()
                .month(month)
                .year(year)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .categoryBreakdown(categoryBreakdown)
                .build();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getYearlyReport(Long userId, Integer year) {
        Profile user = getProfile(userId);

        List<Map<String, Object>> monthlyData = new ArrayList<>();
        BigDecimal yearlyIncome = BigDecimal.ZERO;
        BigDecimal yearlyExpense = BigDecimal.ZERO;

        for (int month = 1; month <= 12; month++) {
            BigDecimal monthIncome = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                    user, Transaction.TransactionType.INCOME, month, year);
            BigDecimal monthExpense = transactionRepository.sumByUserAndTypeAndMonthAndYear(
                    user, Transaction.TransactionType.EXPENSE, month, year);

            yearlyIncome = yearlyIncome.add(monthIncome);
            yearlyExpense = yearlyExpense.add(monthExpense);

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", month);
            monthData.put("income", monthIncome);
            monthData.put("expense", monthExpense);
            monthData.put("balance", monthIncome.subtract(monthExpense));
            monthlyData.add(monthData);
        }

        Map<String, Object> report = new HashMap<>();
        report.put("year", year);
        report.put("totalIncome", yearlyIncome);
        report.put("totalExpense", yearlyExpense);
        report.put("balance", yearlyIncome.subtract(yearlyExpense));
        report.put("monthlyData", monthlyData);

        return report;
    }

    private Profile getProfile(Long userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
