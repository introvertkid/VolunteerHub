package com.springweb.core.dto;

import jakarta.validation.constraints.*;

public record EventCreateDto(

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must not have above 255 characters")
        String title,

        @Size(max = 2000, message = "Description must not have above 2000 characters")
        String description,

        @NotBlank(message = "Category is required")
        @Positive(message = "Category ID must be positive")
        Integer categoryId,

        @NotBlank(message = "Address is required")
        @Size(max = 255, message = "Address must not have above 255 characters")
        String address,

        @NotBlank(message = "City is required")
        @Size(max = 255, message = "City must not have above 255 characters")
        String city,

        @NotBlank(message = "District is required")
        @Size(max = 255, message = "District must not have above 255 characters")
        String district,

        @NotBlank(message = "Ward is required")
        @Size(max = 255, message = "Ward must not have above 255 characters")
        String ward,

        @NotBlank(message = "Start time is required")
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$",
                message = "Start time must be ISO format: YYYY-MM-DDTHH:MM")
        String startAt,

        @NotBlank(message = "Thời gian kết thúc bắt buộc")
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$",
                message = "End time must be ISO format: YYYY-MM-DDTHH:MM")
        String endAt

) {}