package com.smartcampus.ticket.dto;

import com.smartcampus.ticket.entity.TicketCategory;
import com.smartcampus.ticket.entity.TicketPriority;
import com.smartcampus.ticket.entity.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TicketResponse(
        Long id,
        String subject,
        String description,
        String resource,
        TicketCategory category,
        TicketPriority priority,
        TicketStatus status,
        List<String> imageUrls,
        Long ownerUserId,
        String ownerName,
        Long assignedTechnicianId,
        String assignedTechnicianName,
        String resolutionNotes,
        List<TicketCommentResponse> comments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
