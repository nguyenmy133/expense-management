package com.expense.management.controller;

import com.expense.management.model.dto.request.TransactionRequest;
import com.expense.management.model.dto.response.ApiResponse;
import com.expense.management.model.dto.response.TransactionResponse;
import com.expense.management.service.TransactionService;
import com.expense.management.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TransactionRequest request) {

        Long userId = getUserIdFromToken(authHeader);
        TransactionResponse response = transactionService.createTransaction(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {

        Long userId = getUserIdFromToken(authHeader);
        TransactionResponse response = transactionService.updateTransaction(userId, id, request);

        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        Long userId = getUserIdFromToken(authHeader);
        transactionService.deleteTransaction(userId, id);

        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Long userId = getUserIdFromToken(authHeader);
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
        Page<TransactionResponse> response = transactionService.getTransactions(userId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        Long userId = getUserIdFromToken(authHeader);
        TransactionResponse response = transactionService.getTransactionById(userId, id);

        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", response));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Integer month,
            @RequestParam Integer year) {

        Long userId = getUserIdFromToken(authHeader);
        Map<String, Object> stats = transactionService.getStatistics(userId, month, year);

        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", stats));
    }

    @GetMapping("/trend")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTrendData(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Integer month,
            @RequestParam Integer year) {

        Long userId = getUserIdFromToken(authHeader);
        Map<String, Object> trendData = transactionService.getTrendData(userId, month, year);

        return ResponseEntity.ok(ApiResponse.success("Trend data retrieved successfully", trendData));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<java.util.List<TransactionResponse>>> getRecentTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "5") Integer limit) {

        Long userId = getUserIdFromToken(authHeader);
        java.util.List<TransactionResponse> transactions = transactionService.getRecentTransactions(userId, limit);

        return ResponseEntity.ok(ApiResponse.success("Recent transactions retrieved successfully", transactions));
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
