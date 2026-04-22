package com.smartcampus.booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record BookingRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Resource is required")
        String resource,

        @NotBlank(message = "Purpose is required")
        String purpose,

        Integer expectedAttendees,

        @NotNull(message = "Start time is required")
        @FutureOrPresent(message = "Start time must be in the present or future")
        LocalDateTime startTime,

        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        LocalDateTime endTime
) {}
