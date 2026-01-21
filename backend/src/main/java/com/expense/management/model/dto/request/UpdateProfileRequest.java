package com.expense.management.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    private String phone;

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    private String avatarUrl;
}
