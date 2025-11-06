package com.springweb.core.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Setter
@Getter
@Entity
@Table(name = "event_registrations", schema = "spring_boot_db", indexes = {
        @Index(name = "user_id", columnList = "user_id"),
        @Index(name = "event_id", columnList = "event_id"),
        @Index(name = "approved_by", columnList = "approved_by")
})
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registration_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RegistrationStatus status;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "registration_date")
    private Instant registrationDate;

    @Column(name = "cancel_at")
    private Instant cancelAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

}