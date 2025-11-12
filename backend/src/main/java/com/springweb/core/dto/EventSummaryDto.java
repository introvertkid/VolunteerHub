package com.springweb.core.dto;

public record EventSummaryDto(
        Integer eventId,
        String title,
        String city,
        String startAt,           // "2025-12-01T09:00"
        String status,            // "PENDING", "APPROVED", "COMPLETED"
        Long registeredCount
) {}