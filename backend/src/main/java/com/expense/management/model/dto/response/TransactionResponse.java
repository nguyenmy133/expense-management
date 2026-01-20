package com.expense.management.model.dto.response;

import com.expense.management.model.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private BigDecimal amount;
    private Transaction.TransactionType type;
    private LocalDate transactionDate;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
