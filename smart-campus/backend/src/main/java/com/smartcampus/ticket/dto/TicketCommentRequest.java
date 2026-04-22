package com.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TicketCommentRequest(
        @NotBlank(message = "Comment message is required")
        @Size(max = 2000, message = "Comment must not exceed 2000 characters")
        String message
) {}
