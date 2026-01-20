package com.expense.management.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingsDto {
    private GeneralSettings general;
    private NotificationSettings notification;
    private DatabaseSettings database;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeneralSettings {
        private String siteName;
        private String siteDescription;
        private String timezone;
        private String language;
        private String currency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationSettings {
        private boolean enableEmailNotifications;
        private boolean enableBudgetAlerts;
        private int budgetAlertThreshold;
        private boolean enableTransactionNotifications;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatabaseSettings {
        private boolean autoBackup;
        private String backupFrequency;
        private int retentionDays;
    }
}
