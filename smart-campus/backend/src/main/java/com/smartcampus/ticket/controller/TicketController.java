package com.smartcampus.ticket.controller;

import com.smartcampus.ticket.dto.*;
import com.smartcampus.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TicketController {

    private final TicketService ticketService;

    // ── POST /api/tickets ────────────────────────────────────────────────────
    /** Create a new incident ticket (USER / ADMIN / TECHNICIAN). Accepts up to 3 image attachments. */
    @PostMapping(value = "/tickets", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> createTicket(
            @AuthenticationPrincipal OAuth2User principal,
            @Valid @ModelAttribute TicketCreateRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        String email = principal.getAttribute("email");
        TicketResponse response = ticketService.createTicket(email, request, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── GET /api/tickets ─────────────────────────────────────────────────────
    /** List all tickets — ADMIN only. */
    @GetMapping("/tickets")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // ── GET /api/tickets/my ──────────────────────────────────────────────────
    /** List tickets submitted by the currently authenticated user. */
    @GetMapping("/tickets/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(ticketService.getMyTickets(email));
    }

    // ── GET /api/tickets/assigned ────────────────────────────────────────────
    /** List tickets assigned to the currently authenticated technician. */
    @GetMapping("/tickets/assigned")
    public ResponseEntity<List<TicketResponse>> getAssignedTickets(
            @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(ticketService.getTechnicianTickets(email));
    }

    // ── GET /api/tickets/{id} ────────────────────────────────────────────────
    /** Fetch full details of a single ticket, including comments. */
    @GetMapping("/tickets/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // ── PUT /api/tickets/{id}/status ─────────────────────────────────────────
    /** Update ticket status and optionally add resolution notes (TECHNICIAN / ADMIN). */
    @PutMapping("/tickets/{id}/status")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest request,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request, email));
    }

    // ── PUT /api/tickets/{id}/assign ─────────────────────────────────────────
    /** Assign a technician to a ticket — ADMIN only. */
    @PutMapping("/tickets/{id}/assign")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianUserId
    ) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianUserId));
    }

    // ── POST /api/tickets/{id}/comments ──────────────────────────────────────
    /** Add a comment to a ticket. */
    @PostMapping("/tickets/{id}/comments")
    public ResponseEntity<TicketCommentResponse> addComment(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal,
            @Valid @RequestBody TicketCommentRequest request
    ) {
        String email = principal.getAttribute("email");
        TicketCommentResponse response = ticketService.addComment(id, email, request.message());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── PUT /api/tickets/{id}/comments/{commentId} ───────────────────────────
    /** Edit a comment — only the comment's author may do this. */
    @PutMapping("/tickets/{id}/comments/{commentId}")
    public ResponseEntity<TicketCommentResponse> editComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @AuthenticationPrincipal OAuth2User principal,
            @Valid @RequestBody TicketCommentRequest request
    ) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(ticketService.editComment(commentId, email, request.message()));
    }

    // ── DELETE /api/tickets/{id}/comments/{commentId} ────────────────────────
    /** Delete a comment — only the author or an ADMIN may do this. */
    @DeleteMapping("/tickets/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = principal.getAttribute("email");
        ticketService.deleteComment(commentId, email);
        return ResponseEntity.noContent().build();
    }
}
