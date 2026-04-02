package com.smartcampus.ticket.controller;

import com.smartcampus.ticket.dto.TicketResponse;
import com.smartcampus.ticket.entity.TicketStatus;
import com.smartcampus.ticket.service.TicketService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/api")
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/tickets")
    public ResponseEntity<TicketResponse> createTicket(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam @NotBlank String subject,
            @RequestParam @NotBlank String description
    ) {
        String email = principal.getAttribute("email");
        TicketResponse response = ticketService.createTicket(email, subject, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/admin/tickets/{id}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
    }
}
