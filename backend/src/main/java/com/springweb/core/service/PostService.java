package com.springweb.core.service;

import com.springweb.core.dto.CommentCreateDto;
import com.springweb.core.dto.PostCreateDto;
import com.springweb.core.entity.*;
import com.springweb.core.repository.CommentRepository;
import com.springweb.core.repository.EventRepository;
import com.springweb.core.repository.PostLikeRepository;
import com.springweb.core.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final EventRepository eventRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserService userService;

    public PostService(PostRepository postRepository,
                       EventRepository eventRepository,
                       CommentRepository commentRepository,
                       PostLikeRepository postLikeRepository,
                       UserService userService) {
        this.postRepository = postRepository;
        this.eventRepository = eventRepository;
        this.commentRepository = commentRepository;
        this.postLikeRepository = postLikeRepository;
        this.userService = userService;
    }

    public void createNewPost(PostCreateDto dto, String username) {
        Event event = eventRepository.findById(dto.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new IllegalStateException("Event is not approved yet");
        }

        User user = userService.findByEmail(username);

        Post post = new Post();
        post.setEvent(event);
        post.setCreatedBy(user);
        post.setContent(dto.content());
        post.setCreatedDate(Instant.now());

        postRepository.save(post);
    }

    public void addComment(Integer postId, CommentCreateDto dto, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        //todo: post: need to be considered here
        if (post.getEvent() == null || post.getEvent().getStatus() != EventStatus.APPROVED) {
            throw new IllegalStateException("Event is not approved yet");
        }

        User user = userService.findByEmail(username);

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setCommentedBy(user);
        comment.setContent(dto.content());
        comment.setCreatedAt(Instant.now());

        commentRepository.save(comment);
    }

    public boolean toggleLike(Integer postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (post.getEvent() == null || post.getEvent().getStatus() != EventStatus.APPROVED) {
            throw new IllegalStateException("Event is not approved yet");
        }

        User user = userService.findByEmail(username);

        return postLikeRepository.findByPostAndUser(post, user)
                .map(existing -> {
                    postLikeRepository.delete(existing);
                    return false; // now unliked
                })
                .orElseGet(() -> {
                    PostLike like = new PostLike();
                    like.setPost(post);
                    like.setUser(user);
                    postLikeRepository.save(like);
                    return true; // now liked
                });
    }

    public List<Post> getPostsByEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        if (event.getStatus() != EventStatus.APPROVED) {
            throw new IllegalStateException("Event is not approved yet");
        }
        return postRepository.findByEventOrderByCreatedDateDesc(event);
    }

    public List<Comment> getCommentsByPost(Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        return commentRepository.findByPostOrderByCreatedAtDesc(post);
    }
}
