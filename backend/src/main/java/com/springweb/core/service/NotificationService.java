package com.springweb.core.service;

import com.springweb.core.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    /**
     * Gửi thông báo – hiện tại chỉ LOG
     * Sau này thay bằng Web Push / Email / DB
     */
    public void send(User user, String message) {
        log.info("NOTIFICATION → [{}] {}", user.getEmail(), message);
        // TODO: Gửi Web Push API (VAPID) sau
        // TODO: Lưu vào bảng notifications
    }

    /**
     * Đếm thông báo chưa đọc – tạm trả 0
     */
    public int countUnread(User user) {
        return 0; // Chưa có DB
    }
}