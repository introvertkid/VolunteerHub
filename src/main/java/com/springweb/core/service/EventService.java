package com.springweb.core.service;

import com.springweb.core.dto.*;
import com.springweb.core.entity.*;
import com.springweb.core.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
public class EventService {

    private final EventRepository eventRepo;
    private final CategoryRepository categoryRepo;
    private final UserRepository userRepo;
    private final EventRegistrationRepository regRepo;
    private final PostRepository postRepo;
    private final NotificationService notificationService;

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public EventService(EventRepository eventRepo,
                        CategoryRepository categoryRepo,
                        UserRepository userRepo,
                        EventRegistrationRepository regRepo,
                        PostRepository postRepo,
                        NotificationService notificationService) {
        this.eventRepo = eventRepo;
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
        this.regRepo = regRepo;
        this.postRepo = postRepo;
        this.notificationService = notificationService;
    }

    /* ==================== TÌNH NGUYỆN VIÊN ==================== */

    public Page<EventSummaryDto> listEvents(String category, String city, String status, Pageable pageable) {
        Page<Event> page = eventRepo.findApprovedEvents(category, city, status, pageable);
        return page.map(this::toSummaryDto);
    }

    public EventDetailDto getEventDetail(Long eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Sự kiện không tồn tại"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new AccessDeniedException("Sự kiện chưa được duyệt");
        }

        return toDetailDto(event);
    }

    @Transactional
    public void registerEvent(Long eventId, String email) {
        User volunteer = userRepo.getByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Người dùng không tồn tại"));

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Sự kiện không tồn tại"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new IllegalStateException("Sự kiện chưa được duyệt");
        }

        if (regRepo.existsByUserAndEvent(volunteer, event)) {
            throw new IllegalStateException("Bạn đã đăng ký sự kiện này");
        }

        EventRegistration reg = new EventRegistration();
        reg.setUser(volunteer);
        reg.setEvent(event);
        reg.setStatus(RegistrationStatus.PENDING);
        reg.setRegistrationDate(Instant.from(LocalDateTime.now()));
        regRepo.save(reg);

        // Gửi thông báo cho volunteer
        notificationService.send(volunteer, "Đăng ký sự kiện \"" + event.getTitle() + "\" thành công!");

        // Gửi thông báo cho manager
        notificationService.send(event.getCreatedBy(), "Tình nguyện viên " + volunteer.getFullName() + " đăng ký sự kiện của bạn");
    }

    @Transactional
    public void cancelRegistration(Long eventId, String email) {
        User volunteer = userRepo.getByEmail(email).orElseThrow();
        Event event = eventRepo.findById(eventId).orElseThrow();

        EventRegistration reg = regRepo.findByUserAndEvent(volunteer, event)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đăng ký"));

        if (reg.getStatus() == RegistrationStatus.APPROVED && event.getStartAt().isBefore(Instant.from(LocalDateTime.now().plusHours(24)))) {
            throw new IllegalStateException("Không thể hủy trong vòng 24h trước sự kiện");
        }

        reg.setStatus(RegistrationStatus.CANCELLED);
        reg.setCancelAt(Instant.from(LocalDateTime.now()));
        regRepo.save(reg);

        notificationService.send(volunteer, "Hủy đăng ký sự kiện \"" + event.getTitle() + "\" thành công");
    }

    public List<EventRegistrationDto> getMyRegistrations(String email) {
        User user = userRepo.getByEmail(email).orElseThrow();
        return regRepo.findByUser(user).stream()
                .map(this::toRegistrationDto)
                .toList();
    }

    /* ==================== QUẢN LÝ SỰ KIỆN ==================== */

    @Transactional
    public EventCreateResponseDto createEvent(EventCreateDto dto, String email) {
        User manager = userRepo.getByEmail(email).orElseThrow();
        if (!manager.getRole().getName().equals("ROLE_MANAGER")) {
            throw new AccessDeniedException("Chỉ quản lý mới tạo được sự kiện");
        }

        Category category = categoryRepo.findById(dto.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Danh mục không tồn tại"));

        Event event = new Event();
        event.setTitle(dto.title());
        event.setDescription(dto.description());
        event.setCategory(category);
        event.setAddress(dto.address());
        event.setCity(dto.city());
        event.setDistrict(dto.district());
        event.setWard(dto.ward());
        event.setStartAt(Instant.from(LocalDateTime.parse(dto.startAt(), ISO_FORMATTER)));
        event.setEndAt(Instant.from(LocalDateTime.parse(dto.endAt(), ISO_FORMATTER)));
        event.setCreatedBy(manager);
        event.setStatus(EventStatus.PENDING);
        eventRepo.save(event);

        notificationService.send(manager, "Sự kiện \"" + event.getTitle() + "\" đã được tạo, chờ duyệt");

        return new EventCreateResponseDto(event.getId(), "Tạo sự kiện thành công");
    }

    @Transactional
    public void updateEvent(Long eventId, EventUpdateDto dto, String email) {
        User manager = userRepo.getByEmail(email).orElseThrow();
        Event event = eventRepo.findById(eventId).orElseThrow();

        if (!event.getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Bạn không phải chủ sở hữu");
        }
        if (event.getStatus() != EventStatus.PENDING) {
            throw new IllegalStateException("Chỉ sửa được khi đang chờ duyệt");
        }

        updateEventFromDto(event, dto);
        eventRepo.save(event);
    }

    @Transactional
    public void deleteEvent(Long eventId, String email) {
        User manager = userRepo.getByEmail(email).orElseThrow();
        Event event = eventRepo.findById(eventId).orElseThrow();

        if (!event.getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Không có quyền xóa");
        }
        if (regRepo.countByEvent(event) > 0) {
            throw new IllegalStateException("Không thể xóa sự kiện có người đăng ký");
        }

        eventRepo.delete(event);
    }

    @Transactional
    public void approveOrRejectRegistration(Long regId, String action, String managerEmail) {
        User manager = userRepo.getByEmail(managerEmail).orElseThrow();
        EventRegistration reg = regRepo.findById(regId).orElseThrow();

        if (!reg.getEvent().getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Bạn không quản lý sự kiện này");
        }

        RegistrationStatus status = switch (action) {
            case "APPROVE" -> RegistrationStatus.APPROVED;
            case "REJECT" -> RegistrationStatus.REJECTED;
            default -> throw new IllegalArgumentException("Hành động không hợp lệ");
        };

        reg.setStatus(switch (action) {
            case "APPROVE" -> RegistrationStatus.APPROVED;
            case "REJECT" -> RegistrationStatus.REJECTED;
            default -> throw new IllegalArgumentException("Invalid action");
        });
        reg.setApprovedBy(manager);
        regRepo.save(reg);

        String msg = status == RegistrationStatus.APPROVED ?
                "Đăng ký sự kiện \"" + reg.getEvent().getTitle() + "\" đã được duyệt!" :
                "Đăng ký sự kiện \"" + reg.getEvent().getTitle() + "\" bị từ chối";

        notificationService.send(reg.getUser(), msg);
    }

    @Transactional
    public void markRegistrationCompleted(Long regId, String managerEmail) {
        User manager = userRepo.getByEmail(managerEmail).orElseThrow();
        EventRegistration reg = regRepo.findById(regId).orElseThrow();

        if (!reg.getEvent().getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Không có quyền");
        }
        if (reg.getStatus() != RegistrationStatus.APPROVED) {
            throw new IllegalStateException("Chỉ đánh dấu hoàn thành khi đã duyệt");
        }

        reg.setStatus(RegistrationStatus.COMPLETED);
        regRepo.save(reg);

        notificationService.send(reg.getUser(), "Bạn đã hoàn thành sự kiện \"" + reg.getEvent().getTitle() + "\"");
    }

    public List<EventRegistrationDto> getRegistrationsByEvent(Long eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow();
        return regRepo.findByEvent(event).stream()
                .map(this::toRegistrationDto)
                .toList();
    }

    /* ==================== ADMIN ==================== */

    @Transactional
    public void adminReviewEvent(Long eventId, String action) {
        Event event = eventRepo.findById(eventId).orElseThrow();

        EventStatus status = switch (action) {
            case "APPROVE" -> EventStatus.APPROVED;
            case "DELETE" -> {
                eventRepo.delete(event);
                yield null;
            }
            default -> throw new IllegalArgumentException("Hành động không hợp lệ");
        };

        if (status != null) {
            event.setStatus(status);
            eventRepo.save(event);
            notificationService.send(event.getCreatedBy(), "Sự kiện \"" + event.getTitle() + "\" đã được duyệt");
        }
    }

    public String exportEvents(String format) {
        List<Event> events = eventRepo.findAll();
        return format.equals("csv") ? toCsv(events) : toJson(events);
    }

    /* ==================== DASHBOARD ==================== */

    public DashboardDto getDashboard(String email) {
        User user = userRepo.getByEmail(email).orElseThrow();

        List<EventSummaryDto> upcoming = eventRepo.findUpcomingApproved(5).stream()
                .map(this::toSummaryDto).toList();

        List<EventSummaryDto> hot = eventRepo.findHotEvents(5).stream()
                .map(this::toSummaryDto).toList();

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<EventSummaryDto> newPosts = postRepo.findEventsWithRecentPosts(sevenDaysAgo)
                .stream()
                .map(this::toSummaryDto)
                .toList();

        int unread = notificationService.countUnread(user);

        return new DashboardDto(upcoming, hot, newPosts, unread);
    }

    /* ==================== HELPER METHODS ==================== */

    private EventSummaryDto toSummaryDto(Event e) {
        return new EventSummaryDto(
                e.getId(),
                e.getTitle(),
                e.getCity(),
                e.getStartAt().toString(),
                e.getStatus().name(),
                regRepo.countByEvent(e)
        );
    }

    private EventDetailDto toDetailDto(Event e) {
        boolean isReg = false;
        boolean canEdit = false;

        String fullAddress = String.join(", ",
                Stream.of(e.getAddress(), e.getWard(), e.getDistrict(), e.getCity()).filter(s -> s != null && !s.isBlank()).toList());

        return new EventDetailDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getCategory().getCategoryName(),
                fullAddress,
                e.getStartAt().toString(),
                e.getEndAt().toString(),
                e.getStatus().name(),
                regRepo.countByEvent(e),
                isReg,
                canEdit,
                e.getStatus() == EventStatus.APPROVED
        );
    }

    private EventRegistrationDto toRegistrationDto(EventRegistration r) {
        return new EventRegistrationDto(
                r.getId(),
                r.getUser().getId(),
                r.getUser().getFullName(),
                r.getUser().getEmail(),
                r.getStatus().name(),
                r.getRegistrationDate().toString(),
                r.getCancelAt() != null ? r.getCancelAt().toString() : null
        );
    }

    private void updateEventFromDto(Event event, EventUpdateDto dto) {
        if (dto.title() != null) event.setTitle(dto.title());
        if (dto.description() != null) event.setDescription(dto.description());
        if (dto.categoryId() != null) {
            Category cat = categoryRepo.findById(dto.categoryId()).orElseThrow();
            event.setCategory(cat);
        }
        if (dto.address() != null) event.setAddress(dto.address());
        if (dto.city() != null) event.setCity(dto.city());
        if (dto.district() != null) event.setDistrict(dto.district());
        if (dto.ward() != null) event.setWard(dto.ward());
        if (dto.startAt() != null && !dto.startAt().isBlank()) {
            event.setStartAt(Instant.from(LocalDateTime.parse(dto.startAt(), ISO_FORMATTER)));
        }
        if (dto.endAt() != null && !dto.endAt().isBlank()) {
            event.setEndAt(Instant.from(LocalDateTime.parse(dto.endAt(), ISO_FORMATTER)));
        }
    }

    private String toCsv(List<Event> events) {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Tiêu đề,Thành phố,Trạng thái,Số người đăng ký\n");
        events.forEach(e -> sb.append(String.format("%d,%s,%s,%s,%d\n",
                e.getId(), e.getTitle(), e.getCity(), e.getStatus(), regRepo.countByEvent(e))));
        return sb.toString();
    }

    private String toJson(List<Event> events) {
        // Dùng Jackson ObjectMapper trong thực tế
        return events.stream()
                .map(e -> Map.of("id", e.getId(), "title", e.getTitle()))
                .toList()
                .toString();
    }
}