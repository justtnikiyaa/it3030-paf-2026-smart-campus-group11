package com.smartcampus.user.service;

import com.smartcampus.auth.dto.AuthMeResponse;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.user.entity.Role;
import com.smartcampus.user.entity.RoleName;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.RoleRepository;
import com.smartcampus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Value("${app.security.admin-emails:}")
    private String adminEmailsConfig;

    @Transactional
    public User findOrCreateGoogleUser(String googleId, String email, String fullName, String pictureUrl) {
        String normalizedEmail = normalizeEmail(email);
        boolean shouldBeAdmin = isAdminEmail(normalizedEmail);

        return userRepository.findByEmail(email)
                .map(existing -> {
                    existing.setGoogleId(googleId);
                    existing.setFullName(fullName);
                    existing.setPictureUrl(pictureUrl);
                    updateExistingUserRoles(existing, shouldBeAdmin);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> createNewUser(googleId, email, fullName, pictureUrl, shouldBeAdmin));
    }

    public User getByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));
    }

    public User getByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for id: " + id));
    }

    @Transactional
    public void assignRole(Long userId, RoleName roleName) {
        User user = getByIdOrThrow(userId);
        user.getRoles().add(getOrCreateRole(roleName));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public java.util.List<AuthMeResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toAuthMeResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.List<AuthMeResponse> getTechnicians() {
        return userRepository.findByRoleName(RoleName.TECHNICIAN)
                .stream()
                .map(this::toAuthMeResponse)
                .toList();
    }

    public AuthMeResponse toAuthMeResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return new AuthMeResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPictureUrl(),
                roles
        );
    }

    private User createNewUser(String googleId, String email, String fullName, String pictureUrl, boolean shouldBeAdmin) {
        User user = new User();
        user.setGoogleId(googleId);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPictureUrl(pictureUrl);
        assignNewUserRole(user, shouldBeAdmin);
        return userRepository.save(user);
    }

    private void updateExistingUserRoles(User user, boolean shouldBeAdmin) {
        if (shouldBeAdmin) {
            user.getRoles().add(getOrCreateRole(RoleName.ADMIN));
            return;
        }
        ensureAtLeastUserRole(user);
    }

    private void assignNewUserRole(User user, boolean shouldBeAdmin) {
        if (shouldBeAdmin) {
            user.getRoles().add(getOrCreateRole(RoleName.ADMIN));
            return;
        }
        user.getRoles().add(getOrCreateRole(RoleName.USER));
    }

    private void ensureAtLeastUserRole(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.getRoles().add(getOrCreateRole(RoleName.USER));
        }
    }

    private boolean isAdminEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return getConfiguredAdminEmails().contains(email);
    }

    private Set<String> getConfiguredAdminEmails() {
        if (adminEmailsConfig == null || adminEmailsConfig.isBlank()) {
            return Collections.emptySet();
        }

        return Arrays.stream(adminEmailsConfig.split(","))
                .map(this::normalizeEmail)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toSet());
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private Role getOrCreateRole(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
    }
}
