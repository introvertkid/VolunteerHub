package com.springweb.core.controller;

import com.springweb.core.dto.UserLoginDto;
import com.springweb.core.dto.UserRegisterDto;
import com.springweb.core.entity.JwtTokenBlacklist;
import com.springweb.core.repository.JwtTokenBlacklistRepository;
import com.springweb.core.service.UserService;
import com.springweb.core.util.JwtUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final JwtTokenBlacklistRepository jwtTokenBlacklistRepository;

    AuthController(UserService userService,
                   AuthenticationManager authenticationManager,
                   JwtUtils jwtUtils,
                   JwtTokenBlacklistRepository jwtTokenBlacklistRepository) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.jwtTokenBlacklistRepository = jwtTokenBlacklistRepository;
    }

    @PostMapping("/register")
    public UserRegisterDto registerUser(@Valid @RequestBody UserRegisterDto dto) {
        userService.registerUser(dto);
        return dto;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDto dto, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = userService.loadUserByUsername(dto.getEmail());
            String accessToken = jwtUtils.generateAccessToken(userDetails);
            String refreshToken = jwtUtils.generateRefreshToken(userDetails);

            Cookie accessCookie = new Cookie("access_token", accessToken);
            accessCookie.setHttpOnly(true);
            accessCookie.setSecure(true); //HTTPS only
            accessCookie.setAttribute("SameSite", "Strict"); //avoid CSRF
            accessCookie.setPath("/");
            accessCookie.setMaxAge((int) (jwtUtils.getAccessTokenExpirationTimeInMs() / 1000));

            Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge((int) (jwtUtils.getRefreshTokenExpirationTimeInMs() / 1000));

            response.addCookie(accessCookie);
            response.addCookie(refreshCookie);

            return ResponseEntity.ok(Map.of("message", "Login successful"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = jwtUtils.extractAccessToken(request);

        if (token != null && jwtUtils.isValid(token)) {
            String jti = jwtUtils.extractJti(token);
            Instant expiresAt = jwtUtils.extractExpiration(token);

            JwtTokenBlacklist tokenBlacklist = new JwtTokenBlacklist();
            tokenBlacklist.setJti(jti);
            tokenBlacklist.setCreatedAt(Instant.now());
            tokenBlacklist.setExpiresAt(expiresAt);

            jwtTokenBlacklistRepository.save(tokenBlacklist);
        }

        Cookie accessCookie = new Cookie("access_token", null);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);

        Cookie refreshCookie = new Cookie("refresh_token", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

}
