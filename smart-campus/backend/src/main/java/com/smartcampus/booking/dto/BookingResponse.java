package com.smartcampus.booking.dto;

import com.smartcampus.booking.entity.BookingStatus;

import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        String title,
        BookingStatus status,
        Long ownerUserId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
