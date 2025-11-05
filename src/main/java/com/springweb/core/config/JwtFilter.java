package com.springweb.core.config;

import com.springweb.core.repository.JwtTokenBlacklistRepository;
import com.springweb.core.service.UserService;
import com.springweb.core.util.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
class JwtFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final JwtTokenBlacklistRepository blacklistRepository;

    public JwtFilter(JwtUtils jwtUtils, UserService userService, JwtTokenBlacklistRepository blacklistRepository) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.blacklistRepository = blacklistRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = jwtUtils.extractAccessToken(request);

        try {
            if (token != null && jwtUtils.isValid(token)) {
                String jti = jwtUtils.extractJti(token);
                if (!blacklistRepository.existsByJti(jti)) {
                    String email = jwtUtils.extractUsername(token);
                    UserDetails user = userService.loadUserByUsername(email);
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        } catch (Exception e) {
            System.out.println("JWT validation failed: " + e.getMessage());
        } finally {
            filterChain.doFilter(request, response);
        }

    }
}
