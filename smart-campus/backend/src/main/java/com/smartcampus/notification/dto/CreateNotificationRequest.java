package com.smartcampus.notification.dto;

import com.smartcampus.notification.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateNotificationRequest(
        @NotNull Long recipientUserId,
        @NotBlank String title,
        @NotBlank String message,
        @NotNull NotificationType type
) {
}
