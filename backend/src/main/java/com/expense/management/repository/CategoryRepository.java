package com.expense.management.repository;

import com.expense.management.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByType(Category.CategoryType type);

    List<Category> findByIsDefaultTrue();

    boolean existsByNameAndType(String name, Category.CategoryType type);
}
