package com.springweb.core.repository;

import com.springweb.core.entity.Post;
import com.springweb.core.entity.PostLike;
import com.springweb.core.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Integer> {
    Optional<PostLike> findByPostAndUser(Post post, User user);
}
