package com.expense.management.controller;

import com.expense.management.model.dto.request.BudgetRequest;
import com.expense.management.model.dto.response.ApiResponse;
import com.expense.management.model.dto.response.BudgetResponse;
import com.expense.management.service.BudgetService;
import com.expense.management.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody BudgetRequest request) {

        Long userId = getUserIdFromToken(authHeader);
        BudgetResponse response = budgetService.createBudget(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Budget created successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        Long userId = getUserIdFromToken(authHeader);
        budgetService.deleteBudget(userId, id);

        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Integer month,
            @RequestParam Integer year) {

        Long userId = getUserIdFromToken(authHeader);
        List<BudgetResponse> budgets = budgetService.getBudgets(userId, month, year);

        return ResponseEntity.ok(ApiResponse.success("Budgets retrieved successfully", budgets));
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
