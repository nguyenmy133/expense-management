package com.expense.management.controller;

import com.expense.management.model.dto.request.ChangePasswordRequest;
import com.expense.management.model.dto.request.LoginRequest;
import com.expense.management.model.dto.request.RegisterRequest;
import com.expense.management.model.dto.request.UpdateProfileRequest;
import com.expense.management.model.dto.response.ApiResponse;
import com.expense.management.model.dto.response.AuthResponse;
import com.expense.management.model.dto.response.UserResponse;
import com.expense.management.service.AuthService;
import com.expense.management.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        if (userId == null) {
            throw new com.expense.management.exception.UnauthorizedException("Invalid token");
        }

        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateProfileRequest request) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        if (userId == null) {
            throw new com.expense.management.exception.UnauthorizedException("Invalid token");
        }

        UserResponse response = authService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChangePasswordRequest request) {

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        if (userId == null) {
            throw new com.expense.management.exception.UnauthorizedException("Invalid token");
        }

        authService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Change password successfully", null));
    }
}
