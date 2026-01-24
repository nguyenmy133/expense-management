package com.expense.management.model.dto.request;

import com.expense.management.model.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    private String name;
    private Category.CategoryType type;
    private String icon;
    private Long parentId;
}
