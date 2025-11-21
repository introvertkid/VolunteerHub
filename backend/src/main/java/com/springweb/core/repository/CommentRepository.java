package com.springweb.core.repository;

import com.springweb.core.entity.Comment;
import com.springweb.core.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
}
