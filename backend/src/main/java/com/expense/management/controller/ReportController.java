package com.expense.management.controller;

import com.expense.management.model.dto.response.ApiResponse;
import com.expense.management.model.dto.response.MonthlyReportResponse;
import com.expense.management.service.ReportService;
import com.expense.management.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyReportResponse>> getMonthlyReport(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Integer month,
            @RequestParam Integer year) {

        Long userId = getUserIdFromToken(authHeader);
        MonthlyReportResponse report = reportService.getMonthlyReport(userId, month, year);

        return ResponseEntity.ok(ApiResponse.success("Monthly report retrieved successfully", report));
    }

    @GetMapping("/yearly")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getYearlyReport(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Integer year) {

        Long userId = getUserIdFromToken(authHeader);
        Map<String, Object> report = reportService.getYearlyReport(userId, year);

        return ResponseEntity.ok(ApiResponse.success("Yearly report retrieved successfully", report));
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
