package com.springweb.core.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Getter
@Component
public class JwtUtils {
    private final SecretKey key;

    private final long accessTokenExpirationTimeInMs = 1 * 3600 * 1000; //1 hour
    private final long refreshTokenExpirationTimeInMs = 7 * 24 * 60 * 60 * 1000; //7 days

    public JwtUtils(SecretKey key) {
        this.key = key;
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, accessTokenExpirationTimeInMs);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, refreshTokenExpirationTimeInMs);
    }

    public String generateToken(UserDetails userDetails, long expirationTime) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .claim("jti", UUID.randomUUID().toString())
                .signWith(key)
                .compact();
    }

    public String extractAccessToken(HttpServletRequest request) {
        String token = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }
        return token;
    }

    public String extractUsername(String token) {
        return parseAllClaims(token).getSubject();
    }

    public String extractJti(String token) {
        return parseAllClaims(token).get("jti", String.class);
    }

    public Instant extractExpiration(String token) {
        return parseAllClaims(token).getExpiration().toInstant();
    }


    public boolean isValid(String token) {
        try {
            parseAllClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("Token is invalid");
            return false;
        }
    }

    public Claims parseAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
