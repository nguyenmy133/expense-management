package com.expense.management.service;

import com.expense.management.exception.BadRequestException;
import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.exception.UnauthorizedException;
import com.expense.management.model.dto.request.ChangePasswordRequest;
import com.expense.management.model.dto.request.ForgotPasswordRequest;
import com.expense.management.model.dto.request.LoginRequest;
import com.expense.management.model.dto.request.RegisterRequest;
import com.expense.management.model.dto.request.ResetPasswordRequest;
import com.expense.management.model.dto.request.UpdateProfileRequest;
import com.expense.management.model.dto.response.AuthResponse;
import com.expense.management.model.dto.response.UserResponse;
import com.expense.management.model.entity.PasswordResetToken;
import com.expense.management.model.entity.Profile;
import com.expense.management.model.enums.Role;
import com.expense.management.repository.ProfileRepository;
import com.expense.management.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
        private final EmailService emailService;
        private final com.expense.management.repository.PasswordResetTokenRepository passwordResetTokenRepository;

        @Value("${google.client-id}")
        private String googleClientId;

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

        @Transactional
        public void forgotPassword(ForgotPasswordRequest request) {
                // Find user by email
                Profile profile = profileRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email"));

                // Delete any existing reset tokens for this user
                passwordResetTokenRepository.deleteByProfile(profile);

                // Generate random token
                String token = java.util.UUID.randomUUID().toString();

                // Create password reset token (expires in 15 minutes)
                PasswordResetToken resetToken = PasswordResetToken
                                .builder()
                                .token(token)
                                .profile(profile)
                                .expiryDate(java.time.LocalDateTime.now().plusMinutes(15))
                                .build();

                passwordResetTokenRepository.save(resetToken);

                // Send email with reset link
                emailService.sendPasswordResetEmail(profile.getEmail(), token, profile.getFullName());

                log.info("Password reset email sent to: {}", profile.getEmail());
        }

        @Transactional
        public void resetPassword(ResetPasswordRequest request) {
                // Validate passwords match
                if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                        throw new BadRequestException("Passwords do not match");
                }

                // Find token
                PasswordResetToken resetToken = passwordResetTokenRepository
                                .findByToken(request.getToken())
                                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

                // Check if token is expired
                if (resetToken.isExpired()) {
                        throw new BadRequestException("Reset token has expired");
                }

                // Check if token is already used
                if (resetToken.isUsed()) {
                        throw new BadRequestException("Reset token has already been used");
                }

                // Get profile
                Profile profile = resetToken.getProfile();

                // Update password
                profile.setPassword(passwordEncoder.encode(request.getNewPassword()));
                profileRepository.save(profile);

                // Mark token as used
                resetToken.setUsed(true);
                passwordResetTokenRepository.save(resetToken);

                log.info("Password reset successfully for user: {}", profile.getEmail());
        }

        @Transactional
        public AuthResponse googleLogin(com.expense.management.model.dto.request.GoogleLoginRequest request) {
                try {
                        // Verify Google token and get user info
                        com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier = new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(
                                        new com.google.api.client.http.javanet.NetHttpTransport(),
                                        new com.google.api.client.json.gson.GsonFactory())
                                        .setAudience(java.util.Collections.singletonList(googleClientId))
                                        .build();

                        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idToken = verifier
                                        .verify(request.getToken());

                        if (idToken == null) {
                                throw new BadRequestException("Invalid Google token");
                        }

                        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idToken
                                        .getPayload();
                        String googleId = payload.getSubject();
                        String email = payload.getEmail();
                        String name = (String) payload.get("name");
                        String pictureUrl = (String) payload.get("picture");
                        Boolean emailVerified = payload.getEmailVerified();

                        if (!emailVerified) {
                                throw new BadRequestException("Email not verified by Google");
                        }

                        // Check if user exists by Google ID
                        Profile profile = profileRepository.findByGoogleId(googleId).orElse(null);

                        if (profile == null) {
                                // Check if email already exists (registered with local auth)
                                if (profileRepository.existsByEmail(email)) {
                                        throw new BadRequestException(
                                                        "Email already registered with password. Please login with your password.");
                                }

                                // Create new user with Google auth
                                profile = Profile.builder()
                                                .email(email)
                                                .fullName(name)
                                                .googleId(googleId)
                                                .avatarUrl(pictureUrl)
                                                .authProvider(com.expense.management.model.enums.AuthProvider.GOOGLE)
                                                .role(com.expense.management.model.enums.Role.USER)
                                                .build();

                                profile = profileRepository.save(profile);
                                log.info("New user registered via Google: {}", email);
                        } else {
                                // Update user info from Google
                                profile.setFullName(name);
                                profile.setAvatarUrl(pictureUrl);
                                profile = profileRepository.save(profile);
                                log.info("User logged in via Google: {}", email);
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

                } catch (Exception e) {
                        log.error("Google login failed: {}", e.getMessage(), e);
                        throw new BadRequestException("Google login failed: " + e.getMessage());
                }
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
