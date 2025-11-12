package com.springweb.core.dto;

public record EventRegistrationDto(
        Integer registrationId,
        String eventName,
        Integer userId,
        String fullName,
        String email,
        String status,            // "PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"
        String registrationDate,
        String cancelAt
) {}