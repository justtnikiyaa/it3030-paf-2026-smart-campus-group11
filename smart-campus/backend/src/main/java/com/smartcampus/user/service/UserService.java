package com.smartcampus.user.service;

import com.smartcampus.auth.dto.AuthMeResponse;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.user.entity.Role;
import com.smartcampus.user.entity.RoleName;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.RoleRepository;
import com.smartcampus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional
    public User findOrCreateGoogleUser(String googleId, String email, String fullName, String pictureUrl) {
        return userRepository.findByEmail(email)
                .map(existing -> {
                    existing.setGoogleId(googleId);
                    existing.setFullName(fullName);
                    existing.setPictureUrl(pictureUrl);
                    ensureAtLeastUserRole(existing);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> createNewUser(googleId, email, fullName, pictureUrl));
    }

    public User getByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));
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

    private User createNewUser(String googleId, String email, String fullName, String pictureUrl) {
        User user = new User();
        user.setGoogleId(googleId);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPictureUrl(pictureUrl);
        ensureAtLeastUserRole(user);
        return userRepository.save(user);
    }

    private void ensureAtLeastUserRole(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.getRoles().add(getOrCreateRole(RoleName.USER));
        }
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
