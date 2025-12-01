package com.springweb.core.controller;

import com.springweb.core.dto.CommentCreateDto;
import com.springweb.core.dto.PostCreateDto;
import com.springweb.core.entity.Comment;
import com.springweb.core.entity.Post;
import com.springweb.core.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
class PostController {
    private final PostService postService;

    PostController(PostService postService) {
        this.postService = postService;
    }

    // Create a post on an event's channel (only when event is approved)
    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'MANAGER')")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostCreateDto dto,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        postService.createNewPost(dto, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Create new post successfully"));
    }

    // Add a comment to a post (only when event is approved)
    @PostMapping("/{postId}/comments")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'MANAGER')")
    public ResponseEntity<?> addComment(@PathVariable Integer postId,
                                        @Valid @RequestBody CommentCreateDto dto,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        postService.addComment(postId, dto, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Comment added successfully"));
    }

    // Like/Unlike a post toggle (only when event is approved)
    @PostMapping("/{postId}/like")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'MANAGER')")
    public ResponseEntity<?> toggleLike(@PathVariable Integer postId,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        boolean liked = postService.toggleLike(postId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    // List posts by event (only available when event is approved)
    @GetMapping("/by-event/{eventId}")
    public ResponseEntity<List<Post>> listPosts(@PathVariable Integer eventId) {
        List<Post> posts = postService.getPostsByEvent(eventId);
        return ResponseEntity.ok(posts);
    }

    // List comments of a post
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> listComments(@PathVariable Integer postId) {
        List<Comment> comments = postService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }
}
