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

    private final com.expense.management.repository.SystemSettingRepository systemSettingRepository;

    @Transactional(readOnly = true)
    public com.expense.management.model.dto.SystemSettingsDto getSystemSettings() {
        return com.expense.management.model.dto.SystemSettingsDto.builder()
                .general(com.expense.management.model.dto.SystemSettingsDto.GeneralSettings.builder()
                        .siteName(getSettingValue("general.siteName", "Expense Management"))
                        .siteDescription(getSettingValue("general.siteDescription", "Quản lý chi tiêu cá nhân"))
                        .timezone(getSettingValue("general.timezone", "Asia/Ho_Chi_Minh"))
                        .language(getSettingValue("general.language", "vi"))
                        .currency(getSettingValue("general.currency", "VND"))
                        .build())
                .notification(com.expense.management.model.dto.SystemSettingsDto.NotificationSettings.builder()
                        .enableEmailNotifications(
                                Boolean.parseBoolean(getSettingValue("notification.enableEmailNotifications", "true")))
                        .enableBudgetAlerts(
                                Boolean.parseBoolean(getSettingValue("notification.enableBudgetAlerts", "true")))
                        .budgetAlertThreshold(
                                Integer.parseInt(getSettingValue("notification.budgetAlertThreshold", "80")))
                        .enableTransactionNotifications(Boolean
                                .parseBoolean(getSettingValue("notification.enableTransactionNotifications", "false")))
                        .build())
                .database(com.expense.management.model.dto.SystemSettingsDto.DatabaseSettings.builder()
                        .autoBackup(Boolean.parseBoolean(getSettingValue("database.autoBackup", "true")))
                        .backupFrequency(getSettingValue("database.backupFrequency", "daily"))
                        .retentionDays(Integer.parseInt(getSettingValue("database.retentionDays", "30")))
                        .build())
                .build();
    }

    @Transactional
    public com.expense.management.model.dto.SystemSettingsDto updateSystemSettings(
            com.expense.management.model.dto.SystemSettingsDto settings) {
        // General
        saveSetting("general.siteName", settings.getGeneral().getSiteName());
        saveSetting("general.siteDescription", settings.getGeneral().getSiteDescription());
        saveSetting("general.timezone", settings.getGeneral().getTimezone());
        saveSetting("general.language", settings.getGeneral().getLanguage());
        saveSetting("general.currency", settings.getGeneral().getCurrency());

        // Notification
        saveSetting("notification.enableEmailNotifications",
                String.valueOf(settings.getNotification().isEnableEmailNotifications()));
        saveSetting("notification.enableBudgetAlerts",
                String.valueOf(settings.getNotification().isEnableBudgetAlerts()));
        saveSetting("notification.budgetAlertThreshold",
                String.valueOf(settings.getNotification().getBudgetAlertThreshold()));
        saveSetting("notification.enableTransactionNotifications",
                String.valueOf(settings.getNotification().isEnableTransactionNotifications()));

        // Database
        saveSetting("database.autoBackup", String.valueOf(settings.getDatabase().isAutoBackup()));
        saveSetting("database.backupFrequency", settings.getDatabase().getBackupFrequency());
        saveSetting("database.retentionDays", String.valueOf(settings.getDatabase().getRetentionDays()));

        return settings;
    }

    private String getSettingValue(String key, String defaultValue) {
        return systemSettingRepository.findByKey(key)
                .map(com.expense.management.model.entity.SystemSetting::getValue)
                .orElse(defaultValue);
    }

    private void saveSetting(String key, String value) {
        com.expense.management.model.entity.SystemSetting setting = systemSettingRepository.findByKey(key)
                .orElse(com.expense.management.model.entity.SystemSetting.builder().key(key).build());
        setting.setValue(value);
        systemSettingRepository.save(setting);
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
