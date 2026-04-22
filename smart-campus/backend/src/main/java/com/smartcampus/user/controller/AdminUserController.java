package com.smartcampus.user.controller;

import com.smartcampus.user.entity.RoleName;
import com.smartcampus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Admin-only endpoints for user management.
 * Secured globally by SecurityConfig (/api/admin/** → ADMIN only).
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    /**
     * Promote or assign a role to any user.
     * Example: PUT /api/admin/users/5/role?roleName=TECHNICIAN
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<Map<String, String>> assignRole(
            @PathVariable Long userId,
            @RequestParam RoleName roleName
    ) {
        userService.assignRole(userId, roleName);
        return ResponseEntity.ok(Map.of(
                "message", "Role " + roleName + " assigned to user " + userId + " successfully."
        ));
    }

    /**
     * Get all technicians.
     */
    @GetMapping("/technicians")
    public ResponseEntity<java.util.List<com.smartcampus.auth.dto.AuthMeResponse>> getTechnicians() {
        return ResponseEntity.ok(userService.getTechnicians());
    }
}
