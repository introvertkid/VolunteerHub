package com.springweb.core.controller;

import com.springweb.core.dto.*;
import com.springweb.core.service.EventService;
import com.springweb.core.util.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * • Sử dụng DTO để nhận/ trả dữ liệu
 * • Validate bằng @Valid
 * • Trả về ResponseEntity<?> với Map message / error
 * • Dùng JwtUtils để lấy thông tin user từ token
 * • Phân quyền bằng @PreAuthorize
 */
@RestController
@RequestMapping("/api/v1/events")
class EventController {

    private final EventService eventService;
    private final JwtUtils jwtUtils;

    EventController(EventService eventService, JwtUtils jwtUtils) {
        this.eventService = eventService;
        this.jwtUtils = jwtUtils;
    }

    /* ==================== TÌNH NGUYỆN VIÊN / QUẢN LÝ ==================== */

    /** Xem danh sách sự kiện (có phân trang & filter) */
    @GetMapping
    public ResponseEntity<Page<EventSummaryDto>> listEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            Pageable pageable) {

        Page<EventSummaryDto> page = eventService.listEvents(category, city, status, pageable);
        return ResponseEntity.ok(page);
    }

    /** Xem chi tiết một sự kiện */
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDetailDto> getEvent(@PathVariable Long eventId) {
        EventDetailDto dto = eventService.getEventDetail(eventId);
        return ResponseEntity.ok(dto);
    }

    /** Đăng ký tham gia sự kiện (tình nguyện viên) */
    @PostMapping("/{eventId}/register")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<?> registerEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.registerEvent(eventId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Đăng ký sự kiện thành công"));
    }

    /** Hủy đăng ký sự kiện (tình nguyện viên) */
    @DeleteMapping("/{eventId}/register")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<?> cancelRegistration(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.cancelRegistration(eventId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Hủy đăng ký thành công"));
    }

    /** Xem lịch sử tham gia của bản thân */
    @GetMapping("/my-registrations")
    @PreAuthorize("hasRole('VOLUNTEER')")
    public ResponseEntity<List<EventRegistrationDto>> myRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<EventRegistrationDto> list = eventService.getMyRegistrations(userDetails.getUsername());
        return ResponseEntity.ok(list);
    }

    /* ==================== QUẢN LÝ SỰ KIỆN ==================== */

    /** Tạo mới sự kiện (chỉ manager) */
    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<EventCreateResponseDto> createEvent(
            @Valid @RequestBody EventCreateDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        EventCreateResponseDto response = eventService.createEvent(dto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** Cập nhật sự kiện (chỉ manager, chỉ khi chưa duyệt) */
    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventUpdateDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.updateEvent(eventId, dto, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cập nhật sự kiện thành công"));
    }

    /** Xóa sự kiện (chỉ manager, chỉ khi chưa có người đăng ký) */
    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.deleteEvent(eventId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Xóa sự kiện thành công"));
    }

    /** Duyệt / Hủy đăng ký của tình nguyện viên (manager) */
    @PatchMapping("/registrations/{registrationId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> approveRegistration(
            @PathVariable Long registrationId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        String action = body.get("action"); // "APPROVE" or "REJECT"
        eventService.approveOrRejectRegistration(registrationId, action, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Xử lý đăng ký thành công"));
    }

    /** Đánh dấu hoàn thành cho tình nguyện viên (manager) */
    @PatchMapping("/registrations/{registrationId}/complete")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> markCompleted(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.markRegistrationCompleted(registrationId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Đánh dấu hoàn thành thành công"));
    }

    /** Xem danh sách đăng ký của một sự kiện (manager) */
    @GetMapping("/{eventId}/registrations")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<EventRegistrationDto>> listRegistrations(
            @PathVariable Long eventId) {

        List<EventRegistrationDto> list = eventService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(list);
    }

    /* ==================== ADMIN ==================== */

    /** Duyệt / Xóa sự kiện do manager tạo (admin) */
    @PatchMapping("/{eventId}/admin-review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminReviewEvent(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> body) {

        String action = body.get("action"); // "APPROVE" or "DELETE"
        eventService.adminReviewEvent(eventId, action);
        return ResponseEntity.ok(Map.of("message", "Xử lý sự kiện thành công"));
    }

    /** Xuất danh sách sự kiện ra CSV/JSON (admin) */
    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> exportEvents(
            @RequestParam(defaultValue = "json") String format) {

        String data = eventService.exportEvents(format);
        return ResponseEntity.ok()
                .header("Content-Type", format.equals("csv") ? "text/csv" : "application/json")
                .body(data);
    }

    /* ==================== DASHBOARD (tất cả vai trò) ==================== */

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        DashboardDto dashboard = eventService.getDashboard(userDetails.getUsername());
        return ResponseEntity.ok(dashboard);
    }
}