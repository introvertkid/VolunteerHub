package com.springweb.core.util;

import com.springweb.core.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
class JwtUtils {
    private final SecretKey key;

    private final long accessTokenExpirationTimeInMs = 1 * 3600 * 1000; //1 hour
    private final long refreshTokenExpirationTimeInMs = 7 * 24 * 60 * 60 * 1000; //7 days

    public JwtUtils(SecretKey key) {
        this.key = key;
    }

    public String generateAccessToken(User user) {
        return generateToken(user, accessTokenExpirationTimeInMs);
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, refreshTokenExpirationTimeInMs);
    }

    public String generateToken(User user, long expirationTime) {
        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return parseAllClaims(token).getSubject();
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
