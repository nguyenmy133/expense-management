package com.expense.management.repository;

import com.expense.management.model.entity.Budget;
import com.expense.management.model.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

        List<Budget> findByUserAndMonthAndYear(Profile user, Integer month, Integer year);

        Optional<Budget> findByUserAndCategoryIdAndMonthAndYear(
                        Profile user, Long categoryId, Integer month, Integer year);

        boolean existsByUserAndCategoryIdAndMonthAndYear(
                        Profile user, Long categoryId, Integer month, Integer year);
}
