package com.smartcampus.ticket.repository;

import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByOwner_IdOrderByCreatedAtDesc(Long ownerId);

    List<Ticket> findByAssignedTechnician_IdOrderByCreatedAtDesc(Long technicianId);

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    List<Ticket> findAllByOrderByCreatedAtDesc();
}
