package com.expense.management.repository;

import com.expense.management.model.entity.Transaction;
import com.expense.management.model.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

        Page<Transaction> findByUser(Profile user, Pageable pageable);

        Page<Transaction> findByUserAndType(Profile user, Transaction.TransactionType type, Pageable pageable);

        Page<Transaction> findByUserAndTransactionDateBetween(
                        Profile user, LocalDate startDate, LocalDate endDate, Pageable pageable);

        @Query("SELECT t FROM Transaction t WHERE t.user = :user " +
                        "AND (:type IS NULL OR t.type = :type) " +
                        "AND (:categoryId IS NULL OR t.category.id = :categoryId) " +
                        "AND (:startDate IS NULL OR t.transactionDate >= :startDate) " +
                        "AND (:endDate IS NULL OR t.transactionDate <= :endDate)")
        Page<Transaction> findByFilters(
                        @Param("user") Profile user,
                        @Param("type") Transaction.TransactionType type,
                        @Param("categoryId") Long categoryId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
                        "WHERE t.user = :user AND t.type = :type " +
                        "AND EXTRACT(MONTH FROM t.transactionDate) = :month " +
                        "AND EXTRACT(YEAR FROM t.transactionDate) = :year")
        BigDecimal sumByUserAndTypeAndMonthAndYear(
                        @Param("user") Profile user,
                        @Param("type") Transaction.TransactionType type,
                        @Param("month") int month,
                        @Param("year") int year);

        @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
                        "WHERE t.user = :user AND t.type = :type " +
                        "AND t.category.id = :categoryId " +
                        "AND EXTRACT(MONTH FROM t.transactionDate) = :month " +
                        "AND EXTRACT(YEAR FROM t.transactionDate) = :year")
        BigDecimal sumByUserAndCategoryAndMonthAndYear(
                        @Param("user") Profile user,
                        @Param("type") Transaction.TransactionType type,
                        @Param("categoryId") Long categoryId,
                        @Param("month") int month,
                        @Param("year") int year);

        // New methods for Phase 1 dashboard features
        @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
                        "WHERE t.user = :user AND t.type = :type " +
                        "AND t.transactionDate BETWEEN :startDate AND :endDate")
        BigDecimal sumByUserAndTypeAndDateRange(
                        @Param("user") Profile user,
                        @Param("type") Transaction.TransactionType type,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT t FROM Transaction t WHERE t.user = :user " +
                        "ORDER BY t.transactionDate DESC, t.createdAt DESC")
        Page<Transaction> findRecentByUser(@Param("user") Profile user, Pageable pageable);
}
