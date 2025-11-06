package com.springweb.core.dto;

public record EventDetailDto(
        Integer eventId,
        String title,
        String description,
        String categoryName,
        String fullAddress,       // "123 Đường Láng, Đống Đa, Hà Nội"
        String startAt,
        String endAt,
        String status,
        Long registeredCount,
        Boolean isRegistered,     // cho volunteer
        Boolean canEdit,          // cho manager
        Boolean isApproved        // cho manager/admin
) {}