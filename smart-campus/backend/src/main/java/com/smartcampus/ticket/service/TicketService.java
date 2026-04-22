package com.smartcampus.ticket.service;

import com.smartcampus.common.exception.ForbiddenException;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.notification.service.NotificationService;
import com.smartcampus.ticket.dto.*;
import com.smartcampus.ticket.entity.Ticket;
import com.smartcampus.ticket.entity.TicketComment;
import com.smartcampus.ticket.entity.TicketStatus;
import com.smartcampus.ticket.repository.TicketCommentRepository;
import com.smartcampus.ticket.repository.TicketRepository;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final ImageStorageService imageStorageService;

    // ── CREATE ───────────────────────────────────────────────────────────────

    @Transactional
    public TicketResponse createTicket(String ownerEmail,
                                       TicketCreateRequest request,
                                       List<MultipartFile> images) {
        User owner = userService.getByEmailOrThrow(ownerEmail);

        Ticket ticket = new Ticket();
        ticket.setOwner(owner);
        ticket.setSubject(request.subject());
        ticket.setDescription(request.description());
        ticket.setResource(request.resource());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setPreferredContact(request.preferredContact());
        ticket.setStatus(TicketStatus.OPEN);

        List<String> imageUrls = imageStorageService.storeImages(images);
        ticket.setImageUrls(imageUrls);

        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved);
    }

    // ── READ ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long ticketId) {
        Ticket ticket = findOrThrow(ticketId);
        return toResponse(ticket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(String email) {
        User user = userService.getByEmailOrThrow(email);
        return ticketRepository.findByOwner_IdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTechnicianTickets(String email) {
        User tech = userService.getByEmailOrThrow(email);
        return ticketRepository.findByAssignedTechnician_IdOrderByCreatedAtDesc(tech.getId())
                .stream().map(this::toResponse).toList();
    }

    // ── UPDATE STATUS ────────────────────────────────────────────────────────

    @Transactional
    public TicketResponse updateTicketStatus(Long ticketId,
                                             TicketStatusUpdateRequest request,
                                             String updaterEmail) {
        Ticket ticket = findOrThrow(ticketId);
        User updater = userService.getByEmailOrThrow(updaterEmail);

        // Only the assigned technician or an admin may update status
        boolean isAdmin = updater.getRoles().stream()
                .anyMatch(r -> r.getName().name().equals("ADMIN"));
        boolean isAssignedTech = ticket.getAssignedTechnician() != null
                && ticket.getAssignedTechnician().getId().equals(updater.getId());

        if (!isAdmin && !isAssignedTech) {
            throw new ForbiddenException("Only the assigned technician or an admin can update this ticket's status.");
        }

        ticket.setStatus(request.status());
        if (request.resolutionNotes() != null && !request.resolutionNotes().isBlank()) {
            ticket.setResolutionNotes(request.resolutionNotes());
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);

        notificationService.createTicketStatusChangedNotification(
                saved.getOwner().getId(),
                saved.getId(),
                saved.getStatus().name()
        );

        return toResponse(saved);
    }

    // ── ASSIGN TECHNICIAN ────────────────────────────────────────────────────

    @Transactional
    public TicketResponse assignTechnician(Long ticketId, Long technicianUserId) {
        Ticket ticket = findOrThrow(ticketId);
        User technician = userService.getByIdOrThrow(technicianUserId);

        boolean isTech = technician.getRoles().stream()
                .anyMatch(r -> r.getName().name().equals("TECHNICIAN"));
        if (!isTech) {
            throw new IllegalArgumentException("User " + technicianUserId + " does not have the TECHNICIAN role.");
        }

        ticket.setAssignedTechnician(technician);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());
        return toResponse(ticketRepository.save(ticket));
    }

    // ── COMMENTS ─────────────────────────────────────────────────────────────

    @Transactional
    public TicketCommentResponse addComment(Long ticketId, String commenterEmail, String message) {
        Ticket ticket = findOrThrow(ticketId);
        User commenter = userService.getByEmailOrThrow(commenterEmail);

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setCommenter(commenter);
        comment.setMessage(message);

        TicketComment saved = ticketCommentRepository.save(comment);

        // Notify owner only if someone else commented
        if (!saved.getCommenter().getId().equals(ticket.getOwner().getId())) {
            notificationService.createNewCommentNotification(
                    ticket.getOwner().getId(),
                    ticket.getId(),
                    saved.getId()
            );
        }

        return toCommentResponse(saved);
    }

    @Transactional
    public TicketCommentResponse editComment(Long commentId, String editorEmail, String newMessage) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found."));

        User editor = userService.getByEmailOrThrow(editorEmail);
        if (!comment.getCommenter().getId().equals(editor.getId())) {
            throw new ForbiddenException("You can only edit your own comments.");
        }

        comment.setMessage(newMessage);
        comment.setUpdatedAt(LocalDateTime.now());
        return toCommentResponse(ticketCommentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long commentId, String deleterEmail) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found."));

        User deleter = userService.getByEmailOrThrow(deleterEmail);
        boolean isAdmin = deleter.getRoles().stream()
                .anyMatch(r -> r.getName().name().equals("ADMIN"));

        if (!comment.getCommenter().getId().equals(deleter.getId()) && !isAdmin) {
            throw new ForbiddenException("You can only delete your own comments.");
        }

        ticketCommentRepository.delete(comment);
    }

    // ── MAPPING ──────────────────────────────────────────────────────────────

    private TicketResponse toResponse(Ticket ticket) {
        List<TicketCommentResponse> comments =
                ticketCommentRepository.findByTicket_IdOrderByCreatedAtAsc(ticket.getId())
                        .stream().map(this::toCommentResponse).toList();

        return new TicketResponse(
                ticket.getId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getResource(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getImageUrls(),
                ticket.getOwner().getId(),
                ticket.getOwner().getFullName(),
                ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getId() : null,
                ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getFullName() : null,
                ticket.getResolutionNotes(),
                ticket.getPreferredContact(),
                comments,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private TicketCommentResponse toCommentResponse(TicketComment comment) {
        return new TicketCommentResponse(
                comment.getId(),
                comment.getTicket().getId(),
                comment.getCommenter().getId(),
                comment.getCommenter().getFullName(),
                comment.getCommenter().getPictureUrl(),
                comment.getMessage(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }

    private Ticket findOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket #" + id + " not found."));
    }
}
