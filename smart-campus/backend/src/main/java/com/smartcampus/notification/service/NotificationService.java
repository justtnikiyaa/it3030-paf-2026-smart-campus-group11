package com.smartcampus.notification.service;

import com.smartcampus.common.exception.ForbiddenException;
import com.smartcampus.common.exception.ResourceNotFoundException;
import com.smartcampus.notification.dto.CreateNotificationRequest;
import com.smartcampus.notification.dto.NotificationResponse;
import com.smartcampus.notification.dto.UnreadCountResponse;
import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.entity.NotificationPreference;
import com.smartcampus.notification.entity.NotificationType;
import com.smartcampus.notification.repository.NotificationRepository;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.repository.UserRepository;
import com.smartcampus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final NotificationPreferenceService notificationPreferenceService;

    public List<NotificationResponse> getMyNotifications(String email) {
        User user = userService.getByEmailOrThrow(email);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UnreadCountResponse getMyUnreadCount(String email) {
        User user = userService.getByEmailOrThrow(email);
        long count = notificationRepository.countByRecipientIdAndIsReadFalse(user.getId());
        return new UnreadCountResponse(count);
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, String email) {
        User user = userService.getByEmailOrThrow(email);
        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userService.getByEmailOrThrow(email);
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());

        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
                notification.setReadAt(LocalDateTime.now());
            }
        }
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void deleteNotification(Long id, Long currentUserId, boolean isAdmin) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        Long recipientId = notification.getRecipient().getId();
        if (!isAdmin && !recipientId.equals(currentUserId)) {
            throw new ForbiddenException("You can delete only your own notifications.");
        }

        notificationRepository.delete(notification);
    }

    @Transactional
    public void createBookingApprovedNotification(Long userId, Long bookingId) {
        String title = "Booking Approved";
        String message = "Your booking #" + bookingId + " has been approved.";
        createEventNotification(userId, title, message, NotificationType.BOOKING_APPROVED);
    }

    @Transactional
    public void createBookingRejectedNotification(Long userId, Long bookingId) {
        String title = "Booking Rejected";
        String message = "Your booking #" + bookingId + " has been rejected.";
        createEventNotification(userId, title, message, NotificationType.BOOKING_REJECTED);
    }

    @Transactional
    public void createTicketStatusChangedNotification(Long userId, Long ticketId, String status) {
        String title = "Ticket Status Updated";
        String message = "Your ticket #" + ticketId + " status changed to: " + status + ".";
        createEventNotification(userId, title, message, NotificationType.TICKET_STATUS_CHANGED);
    }

    @Transactional
    public void createNewCommentNotification(Long userId, Long ticketId, Long commentId) {
        String title = "New Comment on Ticket";
        String message = "A new comment (#" + commentId + ") was added to your ticket #" + ticketId + ".";
        createEventNotification(userId, title, message, NotificationType.NEW_COMMENT);
    }

    @Transactional
    public NotificationResponse createNotification(CreateNotificationRequest request, String adminEmail) {
        User recipient = userRepository.findById(request.recipientUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found."));

        User createdBy = userService.getByEmailOrThrow(adminEmail);

        Notification notification = new Notification();
        notification.setTitle(request.title());
        notification.setMessage(request.message());
        notification.setType(request.type());
        notification.setRecipient(recipient);
        notification.setCreatedBy(createdBy);

        return toResponse(notificationRepository.save(notification));
    }

    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll().stream().map(this::toResponse).toList();
    }

    public NotificationResponse getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));
        return toResponse(notification);
    }

    private void createEventNotification(Long userId, String title, String message, NotificationType type) {
        User recipient = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found."));

        NotificationPreference preference = notificationPreferenceService.getOrCreateForUser(recipient);
        if (!isAllowedByPreference(type, preference)) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    private boolean isAllowedByPreference(NotificationType type, NotificationPreference preference) {
        return switch (type) {
            case BOOKING_APPROVED, BOOKING_REJECTED -> preference.isBookingNotificationsEnabled();
            case TICKET_STATUS_CHANGED -> preference.isTicketNotificationsEnabled();
            case NEW_COMMENT -> preference.isCommentNotificationsEnabled();
        };
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                !notification.isRead(),
                notification.getCreatedAt(),
                notification.getReadAt(),
                notification.getRecipient().getId()
        );
    }
}
