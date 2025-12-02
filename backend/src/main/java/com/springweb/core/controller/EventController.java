package com.springweb.core.controller;

import com.springweb.core.dto.*;
import com.springweb.core.service.EventService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/events")
class EventController {
    private final EventService eventService;

    EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /** GET: event list */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_VOLUNTEER')")
    public ResponseEntity<Page<EventDetailDto>> listEvents(
            @AuthenticationPrincipal UserDetails userDetails,
            @ModelAttribute EventSearchRequestDto eventSearchRequestDto,
            @Nullable Pageable pageable) {

        Page<EventDetailDto> page = eventService.getEvents(userDetails.getUsername(), eventSearchRequestDto, pageable);
        return ResponseEntity.ok(page);
    }

    /** GET: details of an event */
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDetailDto> getEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer eventId) {
        EventDetailDto dto = eventService.getEventDetail(eventId, userDetails.getUsername());
        return ResponseEntity.ok(dto);
    }

    /** POST: Register an event (For volunteer) */
    @PostMapping("/{eventId}/register")
    @PreAuthorize("hasRole('ROLE_VOLUNTEER')")
    public ResponseEntity<?> registerEvent(
            @PathVariable Integer eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.registerEvent(eventId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Successfully registered event"));
    }

    /** DELETE: Cancel registration for an event (For volunteer) */
    @DeleteMapping("/{eventId}/register")
    @PreAuthorize("hasRole('ROLE_VOLUNTEER')")
    public ResponseEntity<?> cancelRegistration(
            @PathVariable Integer eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.cancelRegistration(eventId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Successfully cancelled your registration"));
    }

    /** GET: Event registrations list (For volunteer) */
    @GetMapping("/my-registrations")
    @PreAuthorize("hasRole('ROLE_VOLUNTEER')")
    public ResponseEntity<List<EventDetailDto>> myRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<EventDetailDto> list = eventService.getMyRegistrations(userDetails.getUsername());
        return ResponseEntity.ok(list);
    }

    /** POST: Create a new event (For manager) */
    @PostMapping
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<?> createEvent(
            @Valid @RequestBody EventCreateDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.createEvent(dto, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Successfully created new event!"));
    }

    /** PUT: Edit event detail (For manager) */
    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<?> updateEvent(
            @PathVariable Integer eventId,
            @Valid @RequestBody EventUpdateDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.updateEvent(eventId, dto, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Successfully updated event details!"));
    }

    /** PATCH: Mark an event as CANCELLED/COMPLETED (For manager) */
    @PatchMapping("/{eventId}/close")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<?> updateEventStatus(
            @PathVariable Integer eventId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {

        String action = body.get("action"); // "COMPLETE" or "CANCEL"

        eventService.closeEvent(eventId, action, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái sự kiện thành công"));
    }

    /** DELETE: Delete an event (For manager) */
    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Integer eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        eventService.deleteEvent(eventId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Successfully deleted the event!"));
    }

    /** PATCH: Approve/Reject volunteer registration for an event (For manager) */
    @PatchMapping("/registrations/{registrationId}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<?> approveRegistration(
            @PathVariable Integer registrationId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        String action = body.get("action");
        eventService.approveOrRejectRegistration(registrationId, action, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Successfully resolved registration!"));
    }

    /** GET: Get registrations list for an event (For manager) */
    @GetMapping("/{eventId}/registrations")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<List<EventRegistrationDto>> listRegistrations(
            @PathVariable Integer eventId) {

        List<EventRegistrationDto> list = eventService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(list);
    }

    /** PATCH: Approve/Reject an event created by a manager (For admin) */
    @PatchMapping("/{eventId}/admin-review")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> adminReviewEvent(
            @PathVariable Integer eventId,
            @RequestBody Map<String, String> body) {

        String action = body.get("action"); // "APPROVE" or "REJECT"
        eventService.adminReviewEvent(eventId, action);
        return ResponseEntity.ok(Map.of("message", "Successfully resolved this event!"));
    }
}