package com.smartcampus.ticket.dto;

import com.smartcampus.ticket.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketStatusUpdateRequest(
        @NotNull(message = "Status is required")
        TicketStatus status,

        @Size(max = 3000, message = "Resolution notes must not exceed 3000 characters")
        String resolutionNotes
) {}
