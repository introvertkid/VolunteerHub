package com.springweb.core.service;

import com.springweb.core.dto.*;
import com.springweb.core.entity.*;
import com.springweb.core.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
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

    public Page<EventDetailDto> getEvents(EventSearchRequestDto req, Pageable pageable) {
        if (pageable == null) {
            pageable = PageRequest.of(0, 10); // giá trị mặc định
        }

        Page<Event> page = eventRepo.findEvents(
                req.category(),
                req.city(),
                req.district(),
                req.ward(),
                req.status(),
                pageable
        );
        return page.map(this::toDetailDto);
    }

    public EventDetailDto getEventDetail(Integer eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found!"));

        return toDetailDto(event);
    }

    @Transactional
    public void registerEvent(Integer eventId, String email) {
        User volunteer = userRepo.getByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found!"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new IllegalStateException("Event has not been approved yet!");
        }

        if (regRepo.existsByUserAndEvent(volunteer, event)) {
            throw new IllegalStateException("You have already registered this event!");
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
    public void cancelRegistration(Integer eventId, String email) {
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

    public List<EventDetailDto> getMyRegistrations(String email) {
        User user = userRepo.getByEmail(email).orElseThrow();
        return regRepo.findByUser(user).stream()
                .map(EventRegistration::getEvent)
                .map(this::toDetailDto)
                .toList();
    }

    /* ==================== QUẢN LÝ SỰ KIỆN ==================== */

    @Transactional
    public void createEvent(EventCreateDto dto, String email) {
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
    }

    @Transactional
    public void updateEvent(Integer eventId, EventUpdateDto dto, String email) {
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
    public void deleteEvent(Integer eventId, String email) {
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
    public void approveOrRejectRegistration(Integer regId, String action, String managerEmail) {
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

    public List<EventRegistrationDto> getRegistrationsByEvent(Integer eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow();
        return regRepo.findByEvent(event).stream()
                .map(this::toRegistrationDto)
                .toList();
    }

    /* ==================== ADMIN ==================== */

    @Transactional
    public void adminReviewEvent(Integer eventId, String action) {
        Event event = eventRepo.findById(eventId).orElseThrow();

        EventStatus status = switch (action) {
            case "APPROVE" -> EventStatus.APPROVED;
            case "REJECT" -> EventStatus.REJECTED;
            default -> throw new IllegalArgumentException("Invalid action!");
        };

        event.setStatus(status);
        eventRepo.save(event);
        notificationService.send(event.getCreatedBy(), "Sự kiện \"" + event.getTitle() + "\" đã được duyệt");
    }

    public String exportEvents(String format) {
        List<Event> events = eventRepo.findAll();
        return format.equals("csv") ? toCsv(events) : toJson(events);
    }

    private EventDetailDto toDetailDto(Event e) {
        // #TODO: Check isReg
        boolean isReg = false;

        return new EventDetailDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getCategory().getCategoryName(),
                e.getAddress(),
                e.getCity(),
                e.getDistrict(),
                e.getWard(),
                e.getStartAt().toString(),
                e.getEndAt().toString(),
                e.getStatus().name(),
                e.getCreatedBy().getFullName(),
                regRepo.countByEvent(e),
                isReg,
                e.getStatus() == EventStatus.APPROVED
        );
    }

    private EventRegistrationDto toRegistrationDto(EventRegistration r) {
        return new EventRegistrationDto(
                r.getId(),
                r.getEvent().getTitle(),
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