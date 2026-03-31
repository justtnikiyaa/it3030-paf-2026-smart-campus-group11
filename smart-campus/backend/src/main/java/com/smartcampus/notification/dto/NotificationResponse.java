package com.smartcampus.notification.dto;

import com.smartcampus.notification.entity.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        NotificationType type,
        boolean unread,
        LocalDateTime createdAt,
        LocalDateTime readAt,
        Long recipientUserId
) {
}
