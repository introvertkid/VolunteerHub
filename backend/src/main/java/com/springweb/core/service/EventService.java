package com.springweb.core.service;

import com.springweb.core.dto.*;
import com.springweb.core.entity.*;
import com.springweb.core.exception.BusinessException;
import com.springweb.core.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

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

    public Page<EventDetailDto> getEvents(String email, String category, String city, String district, String ward, String status, Integer page, Integer size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).descending());

        Page<Event> result = eventRepo.findEvents(
                category,
                city,
                district,
                ward,
                status,
                pageable
        );
        return result.map(event -> toDetailDto(event, email));
    }

    public EventDetailDto getEventDetail(Integer eventId, String email) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));

        return toDetailDto(event, email);
    }

    @Transactional
    public void registerEvent(Integer eventId, String email) {
        User volunteer = userRepo.getByEmail(email)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Không tìm thấy người dùng"));

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new BusinessException("EVENT_NOT_APPROVED", "Sự kiện chưa được duyệt");
        }

        if (regRepo.existsByUserAndEvent(volunteer, event)) {
            throw new BusinessException("USER_ALREADY_REGISTERED_EVENT", "Bạn đã đăng ký sự kiện này");
        }

        EventRegistration reg = new EventRegistration();
        reg.setUser(volunteer);
        reg.setEvent(event);
        reg.setStatus(RegistrationStatus.PENDING);
        reg.setRegistrationDate(Instant.now());
        regRepo.save(reg);

        // Gửi thông báo cho volunteer
        notificationService.send(volunteer, "Đăng ký sự kiện \"" + event.getTitle() + "\" thành công!");

        // Gửi thông báo cho manager
        notificationService.send(event.getCreatedBy(), "Tình nguyện viên " + volunteer.getFullName() + " đăng ký sự kiện của bạn");
    }

    @Transactional
    public void cancelRegistration(Integer eventId, String email) {
        User volunteer = userRepo.getByEmail(email).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Không tìm thấy người dùng"));
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));

        EventRegistration reg = regRepo.findByUserAndEvent(volunteer, event)
                .orElseThrow(() -> new BusinessException("REGISTRATION_NOT_FOUND", "Không tìm thấy đăng ký"));

        if (reg.getStatus() == RegistrationStatus.APPROVED && event.getStartAt().isBefore(Instant.now().plus(Duration.ofHours(24)))) {
            throw new BusinessException("CANCELLATION_TOO_LATE", "Không thể hủy trong vòng 24h trước sự kiện");
        }

        reg.setStatus(RegistrationStatus.CANCELLED);
        reg.setCancelAt(Instant.now());
        regRepo.save(reg);

        notificationService.send(volunteer, "Hủy đăng ký sự kiện \"" + event.getTitle() + "\" thành công");
    }

    public List<EventDetailDto> getMyRegistrations(String email) {
        User user = userRepo.getByEmail(email).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Không tìm thấy người dùng"));
        return regRepo.findByUser(user).stream()
                .map(EventRegistration::getEvent)
                .map(event -> toDetailDto(event, email))
                .toList();
    }

    /* ==================== QUẢN LÝ SỰ KIỆN ==================== */

    @Transactional
    public void createEvent(EventCreateDto dto, String email) {
        User manager = userRepo.getByEmail(email).orElseThrow(() -> new BusinessException("MANAGER_NOT_FOUND", "Không tìm thấy quản lý sự kiện"));

        Category category = categoryRepo.findById(dto.categoryId())
                .orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "Danh mục không tồn tại"));

        Instant startAt = Instant.parse(dto.startAt());
        Instant endAt = Instant.parse(dto.endAt());

        if (startAt.isBefore(Instant.now())) {
            throw new BusinessException("EVENT_START_IN_PAST", "Thời gian bắt đầu sự kiện phải ở trong tương lai");
        }
        if (endAt.isBefore(Instant.now())) {
            throw new BusinessException("EVENT_END_IN_PAST", "Thời gian kết thúc sự kiện phải ở trong tương lai");
        }
        if (endAt.isBefore(startAt)) {
            throw new BusinessException("EVENT_END_BEFORE_START", "Thời gian kết thúc sự kiện phải ở sau thời gian bắt đầu sự kiện");
        }

        Event event = new Event();
        event.setTitle(dto.title());
        event.setDescription(dto.description());
        event.setCategory(category);
        event.setAddress(dto.address());
        event.setCity(dto.city());
        event.setDistrict(dto.district());
        event.setWard(dto.ward());
        event.setStartAt(startAt);
        event.setEndAt(endAt);
        event.setCreatedBy(manager);
        event.setStatus(EventStatus.PENDING);
        eventRepo.save(event);

        notificationService.send(manager, "Sự kiện \"" + event.getTitle() + "\" đã được tạo, chờ duyệt");
    }

    @Transactional
    public void updateEvent(Integer eventId, EventUpdateDto dto, String email) {
        User manager = userRepo.getByEmail(email).orElseThrow(() -> new BusinessException("MANAGER_NOT_FOUND", "Không tìm thấy quản lý sự kiện"));
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));

        if (!event.getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Bạn không phải là người tạo sự kiện này");
        }
        if (event.getStatus() != EventStatus.PENDING) {
            throw new BusinessException("EVENT_NOT_EDITABLE", "Chỉ sửa được khi đang chờ duyệt");
        }

        updateEventFromDto(event, dto);
        eventRepo.save(event);
    }

    @Transactional
    public void closeEvent(Integer eventId, String action, String email) {
        User manager = userRepo.getByEmail(email).orElseThrow(() -> new BusinessException("MANAGER_NOT_FOUND", "Không tìm thấy quản lý sự kiện"));
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));

        if (!event.getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Bạn không phải là người tạo sự kiện này");
        }

        if (action.equalsIgnoreCase("CANCEL")) {
            if (event.getStatus() != EventStatus.PENDING && event.getStatus() != EventStatus.APPROVED) {
                throw new BusinessException("INVALID_ACTION", "Bạn không thể hủy sự kiện đã đóng");
            }

            event.setStatus(EventStatus.CANCELLED);
            eventRepo.save(event);

            notificationService.send(event.getCreatedBy(), "Sự kiện \"" + event.getTitle() + "\" đã bị hủy");
        } else if (action.equalsIgnoreCase("COMPLETE")) {
            if (event.getStatus() != EventStatus.APPROVED) {
                throw new BusinessException("INVALID_ACTION", "Chỉ có thể đánh dấu hoàn thành cho sự kiện đã được APPROVED");
            }

            event.setStatus(EventStatus.COMPLETED);
            eventRepo.save(event);

            regRepo.findByEvent(event).stream()
                    .filter(reg -> reg.getStatus() == RegistrationStatus.APPROVED)
                    .forEach(reg -> reg.setStatus(RegistrationStatus.COMPLETED));

            notificationService.send(event.getCreatedBy(), "Sự kiện \"" + event.getTitle() + "\" đã hoàn thành");
        } else {
            throw new BusinessException("INVALID_ACTION", "Hành động không hợp lệ");
        }
    }

    @Transactional
    public void deleteEvent(Integer eventId, String email) {
        User manager = userRepo.getByEmail(email).orElseThrow(() -> new BusinessException("MANAGER_NOT_FOUND", "Không tìm thấy quản lý sự kiện"));
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));

        if (!event.getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Không có quyền xóa");
        }

        eventRepo.delete(event);
    }

    @Transactional
    public void approveOrRejectRegistration(Integer regId, String action, String managerEmail) {
        User manager = userRepo.getByEmail(managerEmail).orElseThrow(() -> new BusinessException("MANAGER_NOT_FOUND", "Không tìm thấy quản lý sự kiện"));
        EventRegistration reg = regRepo.findById(regId).orElseThrow(() -> new BusinessException("REGISTRATION_NOT_FOUND", "Không tìm thấy đăng ký"));

        if (!reg.getEvent().getCreatedBy().equals(manager)) {
            throw new AccessDeniedException("Bạn không phải là người tạo sự kiện này");
        }

        RegistrationStatus status = switch (action.toUpperCase()) {
            case "APPROVE" -> RegistrationStatus.APPROVED;
            case "REJECT" -> RegistrationStatus.REJECTED;
            default -> throw new BusinessException("INVALID_ACTION", "Hành động không hợp lệ");
        };

        reg.setStatus(switch (action.toUpperCase()) {
            case "APPROVE" -> RegistrationStatus.APPROVED;
            case "REJECT" -> RegistrationStatus.REJECTED;
            default -> throw new BusinessException("INVALID_ACTION", "Hành động không hợp lệ");
        });
        reg.setApprovedBy(manager);
        regRepo.save(reg);

        String msg = status == RegistrationStatus.APPROVED ?
                "Đơn đăng ký cho sự kiện: \"" + reg.getEvent().getTitle() + "\" đã được duyệt" :
                "Đơn đăng ký cho sự kiện: \"" + reg.getEvent().getTitle() + "\" đã bị từ chối";

        notificationService.send(reg.getUser(), msg);
    }

    public List<EventRegistrationDto> getRegistrationsByEvent(Integer eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));
        return regRepo.findByEvent(event).stream()
                .map(this::toRegistrationDto)
                .toList();
    }

    /* ==================== ADMIN ==================== */

    @Transactional
    public void adminReviewEvent(Integer eventId, String action) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new BusinessException("EVENT_NOT_FOUND", "Không tìm thấy sự kiện"));

        EventStatus status = switch (action.toUpperCase()) {
            case "APPROVE" -> EventStatus.APPROVED;
            case "REJECT" -> EventStatus.REJECTED;
            default -> throw new BusinessException("INVALID_ACTION", "Hành động không hợp lệ");
        };

        event.setStatus(status);
        eventRepo.save(event);
        notificationService.send(event.getCreatedBy(), "Sự kiện \"" + event.getTitle() + "\" đã được duyệt");
    }

    public String exportEvents(String format) {
        List<Event> events = eventRepo.findAll();
        return format.equals("csv") ? toCsv(events) : toJson(events);
    }

    private EventDetailDto toDetailDto(Event e, String email) {
        User currentUser = userRepo.getByEmail(email).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "Không tìm thấy người dùng"));
        boolean isReg = regRepo.existsByUserAndEvent(currentUser, e);

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