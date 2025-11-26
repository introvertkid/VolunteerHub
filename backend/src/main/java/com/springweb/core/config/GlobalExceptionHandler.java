package com.springweb.core.config;

import com.springweb.core.dto.APIErrorResponseDto;
import com.springweb.core.exception.BusinessException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(basePackages = "com.springweb.core")
public class GlobalExceptionHandler {
    private ResponseEntity<APIErrorResponseDto> error(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status)
                .body(new APIErrorResponseDto(code, message));
    }

    // Business Exception
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<APIErrorResponseDto> handleBusinessException(BusinessException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getErrorCode(), ex.getMessage());
    }

    // Validation @Valid + @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIErrorResponseDto> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.put(error.getField(), error.getDefaultMessage()));

        String message = fieldErrors.size() == 1
                ? fieldErrors.values().iterator().next()
                : "Dữ liệu không hợp lệ";

        return error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    // Validation @Validated on @PathVariable, @RequestParam
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<APIErrorResponseDto> handleConstraintViolation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .findFirst()
                .orElse("Dữ liệu không hợp lệ");

        return error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    // Authentication exception
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<APIErrorResponseDto> handleAuthentication(AuthenticationException ex) {
        return error(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", ex.getMessage());
    }

    // No permission
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<APIErrorResponseDto> handleAccessDenied(AccessDeniedException ex) {
        return error(HttpStatus.FORBIDDEN, "FORBIDDEN", ex.getMessage());
    }

    // Other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIErrorResponseDto> handleAll(Exception ex) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", ex.getMessage());
    }
}