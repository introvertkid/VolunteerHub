package com.springweb.core.repository;

import com.springweb.core.entity.Event;
import com.springweb.core.entity.EventRegistration;
import com.springweb.core.entity.RegistrationStatus;
import com.springweb.core.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Integer> {

    boolean existsByUserAndEvent(User user, Event event);

    Optional<EventRegistration> findByUserAndEvent(User user, Event event);

    List<EventRegistration> findByUser(User user);

    List<EventRegistration> findByEvent(Event event);

    Integer countByEvent(Event event);
}