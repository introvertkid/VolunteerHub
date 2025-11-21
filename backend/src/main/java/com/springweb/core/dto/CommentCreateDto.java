package com.springweb.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentCreateDto(
        @NotBlank(message = "Content cannot be empty")
        @Size(max = 1000, message = "Maximum size of comment is 1000 characters.")
        String content
) {}
