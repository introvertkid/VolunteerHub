package com.springweb.core.repository;

import com.springweb.core.entity.Event;
import com.springweb.core.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

    @Query("""
        SELECT DISTINCT p.event FROM Post p 
        WHERE p.createdDate > :sevenDaysAgo
        ORDER BY p.createdDate DESC
        """)
    List<Event> findEventsWithRecentPosts(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    List<Post> findByEventOrderByCreatedDateDesc(Event event);
}