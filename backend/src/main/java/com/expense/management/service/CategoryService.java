package com.expense.management.service;

import com.expense.management.exception.BadRequestException;
import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.model.dto.request.CategoryRequest;
import com.expense.management.model.dto.response.CategoryResponse;
import com.expense.management.model.entity.Category;
import com.expense.management.repository.BudgetRepository;
import com.expense.management.repository.CategoryRepository;
import com.expense.management.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByType(Category.CategoryType type) {
        return categoryRepository.findByType(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .icon(request.getIcon())
                .isDefault(false)
                .build();

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent category not found with id: " + request.getParentId()));

            // Validate parent type
            if (parent.getType() != request.getType()) {
                throw new IllegalArgumentException(
                        "Subcategory must be of the same type (INCOME/EXPENSE) as the parent");
            }
            category.setParent(parent);
        }

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setType(request.getType());
        category.setIcon(request.getIcon());

        if (request.getParentId() != null) {
            if (request.getParentId().equals(id)) {
                throw new IllegalArgumentException("Category cannot be its own parent");
            }
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent category not found with id: " + request.getParentId()));

            // Validate parent type
            if (parent.getType() != request.getType()) {
                throw new IllegalArgumentException(
                        "Subcategory must be of the same type (INCOME/EXPENSE) as the parent");
            }
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // 1. Collect all category IDs (self + descendants)
        List<Long> categoryIds = new ArrayList<>();
        collectCategoryIds(category, categoryIds);

        // 2. Cascade Delete: Delete associated transactions first
        transactionRepository.deleteByCategoryIdIn(categoryIds);

        // 3. Cascade Delete: Delete associated budgets next
        budgetRepository.deleteByCategoryIdIn(categoryIds);

        // 4. Finally, delete the category
        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .icon(category.getIcon())
                .color(category.getColor())
                .isDefault(category.getIsDefault())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
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
