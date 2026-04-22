package com.smartcampus.booking.controller;

import com.smartcampus.booking.dto.BookingDecisionRequest;
import com.smartcampus.booking.dto.BookingRequest;
import com.smartcampus.booking.dto.BookingResponse;
import com.smartcampus.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal OAuth2User principal,
            @Valid @RequestBody BookingRequest request
    ) {
        String email = principal.getAttribute("email");
        BookingResponse response = bookingService.createBooking(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/bookings/me")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(bookingService.getMyBookings(email));
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable Long id
    ) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(bookingService.cancelBooking(id, email));
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/admin/bookings/{id}/approve")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingDecisionRequest request
    ) {
        String reason = request != null ? request.adminReason() : null;
        return ResponseEntity.ok(bookingService.approveBooking(id, reason));
    }

    @PatchMapping("/admin/bookings/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingDecisionRequest request
    ) {
        String reason = request != null ? request.adminReason() : null;
        return ResponseEntity.ok(bookingService.rejectBooking(id, reason));
    }
}
