package com.expense.management.controller;

import com.expense.management.model.dto.request.ChatRequest;
import com.expense.management.model.dto.response.ApiResponse;
import com.expense.management.model.dto.response.ChatResponse;
import com.expense.management.service.ChatService;
import com.expense.management.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChatRequest request) {

        Long userId = getUserIdFromToken(authHeader);
        ChatResponse response = chatService.chat(userId, request);

        return ResponseEntity.ok(ApiResponse.success("Chat response generated successfully", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<ChatResponse>>> getChatHistory(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Long userId = getUserIdFromToken(authHeader);
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatResponse> history = chatService.getChatHistory(userId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Chat history retrieved successfully", history));
    }

    @DeleteMapping("/history")
    public ResponseEntity<ApiResponse<Void>> clearChatHistory(
            @RequestHeader("Authorization") String authHeader) {

        Long userId = getUserIdFromToken(authHeader);
        chatService.clearChatHistory(userId);

        return ResponseEntity.ok(ApiResponse.success("Chat history cleared successfully", null));
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
