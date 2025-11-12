package com.springweb.core.repository;

import com.springweb.core.entity.Notification;
import com.springweb.core.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    long countByUserAndIsReadFalse(User user);

    List<Notification> findByUserAndIsReadFalse(User user);
}