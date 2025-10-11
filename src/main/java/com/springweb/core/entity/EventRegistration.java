package com.springweb.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Entity
@Table(name = "event_registrations", schema = "spring_boot_db", indexes = {
        @Index(name = "userId", columnList = "userId"),
        @Index(name = "eventId", columnList = "eventId"),
        @Index(name = "approvedBy", columnList = "approvedBy")
})
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registrationId", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eventId")
    private Event event;

    @Column(name = "status", length = 20)
    private String status;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "registrationDate")
    private Instant registrationDate;

    @Column(name = "cancelAt")
    private Instant cancelAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approvedBy")
    private User approvedBy;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Instant registrationDate) {
        this.registrationDate = registrationDate;
    }

    public Instant getCancelAt() {
        return cancelAt;
    }

    public void setCancelAt(Instant cancelAt) {
        this.cancelAt = cancelAt;
    }

    public User getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(User approvedBy) {
        this.approvedBy = approvedBy;
    }

}