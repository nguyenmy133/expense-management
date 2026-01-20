package com.expense.management.controller;

import com.expense.management.model.dto.request.CreateUserRequest;
import com.expense.management.model.dto.request.UpdateUserRequest;
import com.expense.management.model.dto.response.ApiResponse;
import com.expense.management.model.dto.response.UserResponse;
import com.expense.management.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = adminService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        UserResponse user = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @jakarta.validation.Valid @RequestBody CreateUserRequest request) {
        UserResponse user = adminService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        UserResponse user = adminService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<com.expense.management.model.dto.SystemSettingsDto>> getSystemSettings() {
        com.expense.management.model.dto.SystemSettingsDto settings = adminService.getSystemSettings();
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PostMapping("/settings")
    public ResponseEntity<ApiResponse<com.expense.management.model.dto.SystemSettingsDto>> updateSystemSettings(
            @RequestBody com.expense.management.model.dto.SystemSettingsDto settings) {
        com.expense.management.model.dto.SystemSettingsDto updatedSettings = adminService
                .updateSystemSettings(settings);
        return ResponseEntity.ok(ApiResponse.success(updatedSettings));
    }
}
