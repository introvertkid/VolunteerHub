package com.springweb.core.repository;

import com.springweb.core.entity.JwtTokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JwtTokenBlacklistRepository extends JpaRepository<JwtTokenBlacklist, Integer> {
    boolean existsByJti(String jti);
}
