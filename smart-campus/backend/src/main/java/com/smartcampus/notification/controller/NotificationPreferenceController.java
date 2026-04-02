package com.smartcampus.notification.controller;

import com.smartcampus.notification.dto.NotificationPreferenceResponse;
import com.smartcampus.notification.dto.UpdateNotificationPreferenceRequest;
import com.smartcampus.notification.service.NotificationPreferenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notification-preferences")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final NotificationPreferenceService notificationPreferenceService;

    @GetMapping("/me")
    public ResponseEntity<NotificationPreferenceResponse> getMyPreferences(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(notificationPreferenceService.getMyPreferences(email));
    }

    @PutMapping("/me")
    public ResponseEntity<NotificationPreferenceResponse> updateMyPreferences(
            @AuthenticationPrincipal OAuth2User principal,
            @Valid @RequestBody UpdateNotificationPreferenceRequest request
    ) {
        String email = principal.getAttribute("email");
        return ResponseEntity.ok(notificationPreferenceService.updateMyPreferences(email, request));
    }
}
