package com.springweb.core.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostCreateDto(
        @NotNull(message = "eventId is required when creating a new post")
        Integer eventId,
        @Size(max = 2000, message = "Maximum size of content is 2000 words.")
        String content
) {}
