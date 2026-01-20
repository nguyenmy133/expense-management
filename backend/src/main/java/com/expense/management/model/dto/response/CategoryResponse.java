package com.expense.management.model.dto.response;

import com.expense.management.model.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private Category.CategoryType type;
    private String icon;
    private String color;
    private Boolean isDefault;
}
