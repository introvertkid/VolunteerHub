package com.springweb.core.repository;

import com.springweb.core.entity.Event;
import com.springweb.core.entity.EventStatus;
import com.springweb.core.entity.PostLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Danh sách sự kiện đã duyệt + filter
    @Query("""
        SELECT e FROM Event e 
        WHERE e.status = 'APPROVED'
        AND (:category IS NULL OR e.category.categoryName = :category)
        AND (:city IS NULL OR e.city = :city)
        AND (:status IS NULL OR e.status = :status)
        """)
    Page<Event> findApprovedEvents(
            @Param("category") String category,
            @Param("city") String city,
            @Param("status") String status,
            Pageable pageable);

    // Sự kiện sắp tới (cho dashboard)
    @Query("SELECT e FROM Event e WHERE e.status = 'APPROVED' AND e.startAt > CURRENT_TIMESTAMP ORDER BY e.startAt ASC")
    List<Event> findUpcomingApproved(int limit);

    // Sự kiện "hot" – nhiều đăng ký nhất
    @Query(value = """
        SELECT e.* FROM events e 
        JOIN event_registrations er ON e.event_id = er.event_id 
        WHERE e.status = 'APPROVED'
        GROUP BY e.event_id 
        ORDER BY COUNT(er.registration_id) DESC 
        LIMIT :limit
        """, nativeQuery = true)
    List<Event> findHotEvents(@Param("limit") int limit);

    // Tìm sự kiện theo ID + status
//    Optional<Event> findByEventIdAndStatus(Long eventId, EventStatus status);
}