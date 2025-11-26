package com.springweb.core.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class APIErrorResponseDto {
    private String errorCode;
    private String message;
}