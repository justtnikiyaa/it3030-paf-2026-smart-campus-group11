package com.smartcampus.auth.controller;

import com.smartcampus.auth.dto.AuthMeResponse;
import com.smartcampus.auth.service.AuthService;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    /**
     * Returns the currently authenticated user.
     * Optimized: reads roles directly from the in-memory session (no DB write per request).
     * Falls back to a full DB lookup only on the very first login.
     */
    @GetMapping("/me")
    public ResponseEntity<AuthMeResponse> me(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof OAuth2User oauth2User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = toStringValue(oauth2User.getAttribute("email"));
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String fullName   = toStringValue(oauth2User.getAttribute("name"));
        String pictureUrl = toStringValue(oauth2User.getAttribute("picture"));
        String googleId   = toStringValue(oauth2User.getAttribute("sub"));

        // Fast path: extract roles from the enriched session — zero DB writes
        Set<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .collect(Collectors.toSet());

        if (!roles.isEmpty()) {
            try {
                User user = userService.getByEmailOrThrow(email);
                return ResponseEntity.ok(new AuthMeResponse(
                        user.getId(),
                        email,
                        fullName == null || fullName.isBlank() ? "Google User" : fullName,
                        pictureUrl,
                        roles));
            } catch (Exception ignored) {
                // fall through to full lookup
            }
        }

        // Slow path fallback (first-ever login or session has no ROLE_ authorities)
        User user = userService.findOrCreateGoogleUser(
                googleId == null ? "" : googleId,
                email,
                fullName == null || fullName.isBlank() ? "Google User" : fullName,
                pictureUrl
        );

        return ResponseEntity.ok(authService.toAuthMeResponse(user));
    }

    private String toStringValue(Object value) {
        return value == null ? null : value.toString();
    }
}
