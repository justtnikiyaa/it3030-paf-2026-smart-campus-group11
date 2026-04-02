package com.smartcampus.notification.service;

import com.smartcampus.notification.dto.NotificationPreferenceResponse;
import com.smartcampus.notification.dto.UpdateNotificationPreferenceRequest;
import com.smartcampus.notification.entity.NotificationPreference;
import com.smartcampus.notification.repository.NotificationPreferenceRepository;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository preferenceRepository;
    private final UserService userService;

    @Transactional
    public NotificationPreferenceResponse getMyPreferences(String email) {
        User user = userService.getByEmailOrThrow(email);
        NotificationPreference preference = getOrCreateForUser(user);
        return toResponse(preference);
    }

    @Transactional
    public NotificationPreferenceResponse updateMyPreferences(String email, UpdateNotificationPreferenceRequest request) {
        User user = userService.getByEmailOrThrow(email);
        NotificationPreference preference = getOrCreateForUser(user);

        preference.setBookingNotificationsEnabled(request.bookingNotificationsEnabled());
        preference.setTicketNotificationsEnabled(request.ticketNotificationsEnabled());
        preference.setCommentNotificationsEnabled(request.commentNotificationsEnabled());
        preference.setEmailNotificationsEnabled(request.emailNotificationsEnabled());

        return toResponse(preferenceRepository.save(preference));
    }

    @Transactional
    public NotificationPreference getOrCreateForUser(User user) {
        return preferenceRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    NotificationPreference preference = new NotificationPreference();
                    preference.setUser(user);
                    return preferenceRepository.save(preference);
                });
    }

    private NotificationPreferenceResponse toResponse(NotificationPreference preference) {
        return new NotificationPreferenceResponse(
                preference.isBookingNotificationsEnabled(),
                preference.isTicketNotificationsEnabled(),
                preference.isCommentNotificationsEnabled(),
                preference.isEmailNotificationsEnabled()
        );
    }
}
