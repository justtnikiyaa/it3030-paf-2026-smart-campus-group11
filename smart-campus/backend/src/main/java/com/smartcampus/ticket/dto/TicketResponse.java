package com.smartcampus.ticket.dto;

import com.smartcampus.ticket.entity.TicketStatus;

import java.time.LocalDateTime;

public record TicketResponse(
        Long id,
        String subject,
        String description,
        TicketStatus status,
        Long ownerUserId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
