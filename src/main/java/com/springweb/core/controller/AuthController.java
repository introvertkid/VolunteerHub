package com.springweb.core.controller;

import com.springweb.core.dto.UserRegisterDto;
import com.springweb.core.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/auth")
class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserRegisterDto registerUser(@Valid @RequestBody UserRegisterDto dto) {
        userService.registerUser(dto);
        return dto;
    }
}
