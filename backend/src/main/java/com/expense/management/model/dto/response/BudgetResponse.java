package com.expense.management.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private BigDecimal amount;
    private Integer month;
    private Integer year;
    private BigDecimal spent; // Calculated field
    private BigDecimal remaining; // Calculated field
    private Double percentage; // Calculated field
}
