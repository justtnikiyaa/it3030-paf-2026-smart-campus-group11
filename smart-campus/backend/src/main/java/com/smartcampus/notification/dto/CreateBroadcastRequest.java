package com.smartcampus.notification.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateBroadcastRequest(
        @NotBlank String title,
        @NotBlank String message
) {
}
