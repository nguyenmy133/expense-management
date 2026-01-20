package com.expense.management.service;

import com.expense.management.exception.BadRequestException;
import com.expense.management.exception.ResourceNotFoundException;
import com.expense.management.model.dto.request.CreateUserRequest;
import com.expense.management.model.dto.request.UpdateUserRequest;
import com.expense.management.model.dto.response.UserResponse;
import com.expense.management.model.entity.Profile;
import com.expense.management.model.enums.Role;
import com.expense.management.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProfileRepository profileRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return profileRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(profile);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (profileRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Role role;
        try {
            role = request.getRole() != null ? Role.valueOf(request.getRole().toUpperCase()) : Role.USER;
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + request.getRole());
        }

        Profile profile = Profile.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(role)
                .build();

        Profile savedProfile = profileRepository.save(profile);
        return mapToUserResponse(savedProfile);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().equals(profile.getEmail())) {
            if (profileRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            profile.setEmail(request.getEmail());
        }

        if (request.getFullName() != null) {
            profile.setFullName(request.getFullName());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            profile.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null) {
            try {
                Role role = Role.valueOf(request.getRole().toUpperCase());
                profile.setRole(role);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid role: " + request.getRole());
            }
        }

        Profile updatedProfile = profileRepository.save(profile);
        return mapToUserResponse(updatedProfile);
    }

    @Transactional
    public UserResponse updateUserRole(Long id, String roleStr) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        try {
            Role role = Role.valueOf(roleStr.toUpperCase());
            profile.setRole(role);
            Profile updatedProfile = profileRepository.save(profile);
            return mapToUserResponse(updatedProfile);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + roleStr);
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!profileRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        profileRepository.deleteById(id);
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
