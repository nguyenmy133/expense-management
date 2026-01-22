package com.expense.management.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String apiUrl;

    private final RestClient restClient;

    public GeminiService() {
        this.restClient = RestClient.builder().build();
    }

    public String generateContent(String prompt) {
        try {
            GeminiRequest request = new GeminiRequest(prompt);

            GeminiResponse response = restClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                return response.getCandidates().get(0).getContent().getParts().get(0).getText();
            }

            return "Xin lỗi, tôi không thể trả lời câu hỏi lúc này.";
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "Đã xảy ra lỗi khi kết nối với AI (Vui lòng kiểm tra API Key). Lỗi: " + e.getMessage();
        }
    }

    // DTOs for Gemini API Request/Response
    @Data
    public static class GeminiRequest {
        private List<Content> contents;

        public GeminiRequest(String text) {
            this.contents = Collections.singletonList(new Content(text));
        }

        @Data
        public static class Content {
            private List<Part> parts;

            public Content(String text) {
                this.parts = Collections.singletonList(new Part(text));
            }
        }

        @Data
        public static class Part {
            private String text;

            public Part(String text) {
                this.text = text;
            }
        }
    }

    @Data
    public static class GeminiResponse {
        private List<Candidate> candidates;

        @Data
        public static class Candidate {
            private Content content;
        }

        @Data
        public static class Content {
            private List<Part> parts;
        }

        @Data
        public static class Part {
            private String text;
        }
    }
}
