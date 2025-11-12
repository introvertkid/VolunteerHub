package com.springweb.core.dto;

public record EventDetailDto(
        Integer eventId,
        String title,
        String description,
        String categoryName,
        String address,
        String city,
        String district,
        String ward,
        String startAt,
        String endAt,
        String status,
        String createdBy,
        Integer registeredCount,
        Boolean isRegistered,     // cho volunteer
        Boolean isApproved        // cho manager/admin
) {}