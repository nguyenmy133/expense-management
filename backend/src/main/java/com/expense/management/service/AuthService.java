package com.expense.management.service;

import com.expense.management.exception.BadRequestException;
import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.exception.UnauthorizedException;
import com.expense.management.model.dto.request.ChangePasswordRequest;
import com.expense.management.model.dto.request.LoginRequest;
import com.expense.management.model.dto.request.RegisterRequest;
import com.expense.management.model.dto.request.UpdateProfileRequest;
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

                // Ensure profile is not null before saving (satisfies strict null analysis)
                if (profile == null)
                        throw new IllegalStateException("Profile builder returned null");

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
        public UserResponse getCurrentUser(@org.springframework.lang.NonNull Long userId) {
                Profile profile = profileRepository.findById(userId)
                                .orElseThrow(() -> new UnauthorizedException("User not found"));

                return mapToUserResponse(profile);
        }

        @Transactional
        public UserResponse updateProfile(@org.springframework.lang.NonNull Long userId, UpdateProfileRequest request) {
                Profile profile = profileRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                if (request.getFullName() != null) {
                        profile.setFullName(request.getFullName());
                }
                if (request.getPhone() != null) {
                        profile.setPhone(request.getPhone());
                }
                if (request.getBio() != null) {
                        profile.setBio(request.getBio());
                }
                if (request.getAvatarUrl() != null) {
                        profile.setAvatarUrl(request.getAvatarUrl());
                }

                Profile savedProfile = profileRepository.save(profile);
                return mapToUserResponse(savedProfile);
        }

        @Transactional
        public void changePassword(@org.springframework.lang.NonNull Long userId, ChangePasswordRequest request) {
                if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                        throw new BadRequestException("New password and confirmation password do not match");
                }

                Profile profile = profileRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                if (!passwordEncoder.matches(request.getCurrentPassword(), profile.getPassword())) {
                        throw new BadRequestException("Current password is incorrect");
                }

                profile.setPassword(passwordEncoder.encode(request.getNewPassword()));
                profileRepository.save(profile);
        }

        private UserResponse mapToUserResponse(Profile profile) {
                return UserResponse.builder()
                                .id(profile.getId())
                                .email(profile.getEmail())
                                .fullName(profile.getFullName())
                                .avatarUrl(profile.getAvatarUrl())
                                .phone(profile.getPhone())
                                .bio(profile.getBio())
                                .role(profile.getRole().name())
                                .createdAt(profile.getCreatedAt())
                                .build();
        }
}
