package com.expense.management.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "category_id", "month",
                "year" }), indexes = {
                                @Index(name = "idx_budgets_user_id", columnList = "user_id"),
                                @Index(name = "idx_budgets_category_id", columnList = "category_id"),
                                @Index(name = "idx_budgets_month_year", columnList = "month, year")
                })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Budget {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private Profile user;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "category_id")
        private Category category;

        @Column(nullable = false, precision = 15, scale = 2)
        private BigDecimal amount;

        @Column(nullable = false)
        private Integer month;

        @Column(nullable = false)
        private Integer year;

        @CreatedDate
        @Column(name = "created_at", nullable = false, updatable = false)
        private LocalDateTime createdAt;

        @LastModifiedDate
        @Column(name = "updated_at")
        private LocalDateTime updatedAt;
}
