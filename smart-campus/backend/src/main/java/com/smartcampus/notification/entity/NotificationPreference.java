package com.smartcampus.notification.entity;

import com.smartcampus.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private boolean bookingNotificationsEnabled = true;

    @Column(nullable = false)
    private boolean ticketNotificationsEnabled = true;

    @Column(nullable = false)
    private boolean commentNotificationsEnabled = true;

    @Column(nullable = false)
    private boolean emailNotificationsEnabled = false;
}
