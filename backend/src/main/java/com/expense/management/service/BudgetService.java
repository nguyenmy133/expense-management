package com.expense.management.service;

import com.expense.management.exception.BadRequestException;
import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.exception.UnauthorizedException;
import com.expense.management.model.dto.request.BudgetRequest;
import com.expense.management.model.dto.response.BudgetResponse;
import com.expense.management.model.entity.Budget;
import com.expense.management.model.entity.Category;
import com.expense.management.model.entity.Profile;
import com.expense.management.model.entity.Transaction;
import com.expense.management.repository.BudgetRepository;
import com.expense.management.repository.CategoryRepository;
import com.expense.management.repository.ProfileRepository;
import com.expense.management.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ProfileRepository profileRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public BudgetResponse createBudget(Long userId, BudgetRequest request) {
        Profile user = getProfile(userId);
        Category category = null;

        if (request.getCategoryId() != null) {
            category = getCategory(request.getCategoryId());

            // Check if budget already exists
            if (budgetRepository.existsByUserAndCategoryIdAndMonthAndYear(
                    user, request.getCategoryId(), request.getMonth(), request.getYear())) {
                throw new BadRequestException("Budget already exists for this category and period");
            }
        }

        Budget budget = Budget.builder()
                .user(user)
                .category(category)
                .amount(request.getAmount())
                .month(request.getMonth())
                .year(request.getYear())
                .build();

        Budget saved = budgetRepository.save(budget);
        return mapToResponse(saved, user);
    }

    @Transactional
    public BudgetResponse updateBudget(Long userId, Long budgetId, BudgetRequest request) {
        Budget budget = getBudget(budgetId);
        Profile user = getProfile(userId);

        if (!budget.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to update this budget");
        }

        Long newCategoryId = request.getCategoryId();
        Long oldCategoryId = budget.getCategory() != null ? budget.getCategory().getId() : null;

        boolean isKeyChanged = (newCategoryId == null && oldCategoryId != null) ||
                (newCategoryId != null && !newCategoryId.equals(oldCategoryId)) ||
                !request.getMonth().equals(budget.getMonth()) ||
                !request.getYear().equals(budget.getYear());

        if (isKeyChanged) {
            if (budgetRepository.existsByUserAndCategoryIdAndMonthAndYear(
                    user, request.getCategoryId(), request.getMonth(), request.getYear())) {
                throw new BadRequestException("Budget already exists for this category and period");
            }
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = getCategory(request.getCategoryId());
        }

        budget.setCategory(category);
        budget.setAmount(request.getAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        Budget saved = budgetRepository.save(budget);
        return mapToResponse(saved, user);
    }

    @Transactional
    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = getBudget(budgetId);

        if (!budget.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to delete this budget");
        }

        budgetRepository.delete(budget);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(Long userId, Integer month, Integer year) {
        Profile user = getProfile(userId);
        return budgetRepository.findByUserAndMonthAndYear(user, month, year).stream()
                .map(budget -> mapToResponse(budget, user))
                .collect(Collectors.toList());
    }

    private Profile getProfile(Long userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private Budget getBudget(Long budgetId) {
        return budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
    }

    private BudgetResponse mapToResponse(Budget budget, Profile user) {
        BigDecimal spent = BigDecimal.ZERO;

        if (budget.getCategory() != null) {
            Category category = budget.getCategory();
            java.util.List<Long> categoryIds = new java.util.ArrayList<>();
            collectCategoryIds(category, categoryIds);

            spent = transactionRepository.sumByUserAndCategoryIdsAndMonthAndYear(
                    user,
                    Transaction.TransactionType.EXPENSE,
                    categoryIds,
                    budget.getMonth(),
                    budget.getYear());
        }

        BigDecimal remaining = budget.getAmount().subtract(spent);
        Double percentage = spent.divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();

        return BudgetResponse.builder()
                .id(budget.getId())
                .categoryId(budget.getCategory() != null ? budget.getCategory().getId() : null)
                .categoryName(budget.getCategory() != null ? budget.getCategory().getName() : "Tổng")
                .amount(budget.getAmount())
                .month(budget.getMonth())
                .year(budget.getYear())
                .spent(spent)
                .remaining(remaining)
                .percentage(percentage)
                .build();
    }

    private void collectCategoryIds(Category category, List<Long> ids) {
        ids.add(category.getId());
        if (category.getChildren() != null) {
            for (Category child : category.getChildren()) {
                collectCategoryIds(child, ids);
            }
        }
    }
}
