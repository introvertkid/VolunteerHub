package com.springweb.core.dto;

public record EventSearchRequestDto(
        String category,
        String city,
        String district,
        String ward,
        String status
) {}