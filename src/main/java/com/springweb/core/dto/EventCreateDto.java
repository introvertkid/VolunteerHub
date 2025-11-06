package com.springweb.core.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public record EventCreateDto(

        @NotBlank(message = "Tiêu đề không được để trống")
        @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
        String title,

        @Size(max = 2000, message = "Mô tả tối đa 2000 ký tự")
        String description,

        @NotNull(message = "Danh mục bắt buộc")
        @Positive(message = "ID danh mục phải là số dương")
        Long categoryId,

        @NotBlank(message = "Địa chỉ cụ thể bắt buộc")
        @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
        String address,

        @NotBlank(message = "Tỉnh/Thành phố bắt buộc")
        String city,

        String district,
        String ward,

        @NotBlank(message = "Thời gian bắt đầu bắt buộc")
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$",
                message = "Thời gian bắt đầu phải định dạng ISO: YYYY-MM-DDTHH:MM")
        String startAt,

        @NotBlank(message = "Thời gian kết thúc bắt buộc")
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$",
                message = "Thời gian kết thúc phải định dạng ISO: YYYY-MM-DDTHH:MM")
        String endAt

) {}