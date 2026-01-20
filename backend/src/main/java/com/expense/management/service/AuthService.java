package com.expense.management.service;

import com.expense.management.exception.BadRequestException;
import com.expense.management.exception.UnauthorizedException;
import com.expense.management.model.dto.request.LoginRequest;
import com.expense.management.model.dto.request.RegisterRequest;
import com.expense.management.model.dto.response.AuthResponse;
import com.expense.management.model.dto.response.UserResponse;
import com.expense.management.model.entity.Profile;
import com.expense.management.model.enums.Role;
import com.expense.management.repository.ProfileRepository;
import com.expense.management.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

        private final ProfileRepository profileRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenProvider jwtTokenProvider;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                // Check if email already exists
                if (profileRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email already exists");
                }

                // Create new profile
                Profile profile = Profile.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .fullName(request.getFullName())
                                .role(Role.USER)
                                .build();

                Profile savedProfile = profileRepository.save(profile);

                // Generate JWT token
                String token = jwtTokenProvider.generateToken(
                                savedProfile.getId(),
                                savedProfile.getEmail(),
                                savedProfile.getRole().name());

                // Build response
                UserResponse userResponse = mapToUserResponse(savedProfile);

                return AuthResponse.builder()
                                .token(token)
                                .user(userResponse)
                                .build();
        }

        @Transactional(readOnly = true)
        public AuthResponse login(LoginRequest request) {
                // Find user by email
                Profile profile = profileRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

                // Verify password
                if (!passwordEncoder.matches(request.getPassword(), profile.getPassword())) {
                        throw new UnauthorizedException("Invalid email or password");
                }

                // Generate JWT token
                String token = jwtTokenProvider.generateToken(
                                profile.getId(),
                                profile.getEmail(),
                                profile.getRole().name());

                // Build response
                UserResponse userResponse = mapToUserResponse(profile);

                return AuthResponse.builder()
                                .token(token)
                                .user(userResponse)
                                .build();
        }

        @Transactional(readOnly = true)
        public UserResponse getCurrentUser(Long userId) {
                Profile profile = profileRepository.findById(userId)
                                .orElseThrow(() -> new UnauthorizedException("User not found"));

                return mapToUserResponse(profile);
        }

        private UserResponse mapToUserResponse(Profile profile) {
                return UserResponse.builder()
                                .id(profile.getId())
                                .email(profile.getEmail())
                                .fullName(profile.getFullName())
                                .avatarUrl(profile.getAvatarUrl())
                                .role(profile.getRole().name())
                                .createdAt(profile.getCreatedAt())
                                .build();
        }
}
