package com.smartcampus.notification.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateNotificationPreferenceRequest(
        @NotNull Boolean bookingNotificationsEnabled,
        @NotNull Boolean ticketNotificationsEnabled,
        @NotNull Boolean commentNotificationsEnabled,
        @NotNull Boolean emailNotificationsEnabled
) {
}
