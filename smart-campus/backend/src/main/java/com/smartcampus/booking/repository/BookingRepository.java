package com.smartcampus.booking.repository;

import com.smartcampus.booking.entity.Booking;
import com.smartcampus.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    
    List<Booking> findAllByOrderByCreatedAtDesc();

    boolean existsByResourceAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            String resource, 
            List<BookingStatus> statuses, 
            LocalDateTime endTime, 
            LocalDateTime startTime
    );
}
