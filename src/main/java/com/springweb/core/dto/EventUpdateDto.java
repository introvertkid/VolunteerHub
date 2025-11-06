package com.springweb.core.dto;

import jakarta.validation.constraints.*;

public record EventUpdateDto(

        @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
        String title,

        @Size(max = 2000, message = "Mô tả tối đa 2000 ký tự")
        String description,

        @Positive(message = "ID danh mục phải là số dương")
        Long categoryId,

        @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
        String address,

        String city,
        String district,
        String ward,

        @Pattern(regexp = "^(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?)?$",
                message = "Thời gian phải định dạng ISO hoặc để trống")
        String startAt,

        @Pattern(regexp = "^(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?)?$",
                message = "Thời gian phải định dạng ISO hoặc để trống")
        String endAt

) {}