package com.smartcampus.notification.dto;

public record NotificationPreferenceResponse(
        boolean bookingNotificationsEnabled,
        boolean ticketNotificationsEnabled,
        boolean commentNotificationsEnabled,
        boolean emailNotificationsEnabled
) {
}
