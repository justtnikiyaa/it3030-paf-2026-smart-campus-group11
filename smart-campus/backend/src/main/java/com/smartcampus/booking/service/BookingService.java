package com.smartcampus.booking.service;

import com.smartcampus.booking.dto.BookingRequest;
import com.smartcampus.booking.dto.BookingResponse;
import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;
import com.smartcampus.booking.repository.BookingRepository;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponse createBooking(String ownerEmail, BookingRequest request) {
        if (!request.startTime().isBefore(request.endTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        boolean hasConflict = bookingRepository.existsByResourceAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                request.resource(),
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED),
                request.endTime(),
                request.startTime()
        );

        if (hasConflict) {
            throw new IllegalStateException("The requested resource is already booked for the given time range.");
        }

        User owner = userService.getByEmailOrThrow(ownerEmail);

        Booking booking = new Booking();
        booking.setOwner(owner);
        booking.setTitle(request.title());
        booking.setResource(request.resource());
        booking.setStartTime(request.startTime());
        booking.setEndTime(request.endTime());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookings(String ownerEmail) {
        User owner = userService.getByEmailOrThrow(ownerEmail);
        return bookingRepository.findByOwnerIdOrderByCreatedAtDesc(owner.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String ownerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        User user = userService.getByEmailOrThrow(ownerEmail);
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == com.smartcampus.user.entity.RoleName.ADMIN);

        if (!isAdmin && !booking.getOwner().getEmail().equals(ownerEmail)) {
            throw new IllegalStateException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.REJECTED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Cannot cancel a booking that is already rejected or cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse approveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be approved.");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);

        // Notification hook: run immediately after successful approval.
        notificationService.createBookingApprovedNotification(saved.getOwner().getId(), saved.getId());

        return toResponse(saved);
    }

    @Transactional
    public BookingResponse rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only pending bookings can be rejected.");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);

        // Notification hook: run immediately after successful rejection.
        notificationService.createBookingRejectedNotification(saved.getOwner().getId(), saved.getId());

        return toResponse(saved);
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getTitle(),
                booking.getResource(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus(),
                booking.getOwner().getId(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
