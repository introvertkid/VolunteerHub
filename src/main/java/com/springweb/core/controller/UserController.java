package com.springweb.core.controller;

import com.springweb.core.entity.User;
import com.springweb.core.service.UserService;
import com.springweb.core.util.ExportDataUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
class UserController {
    private final UserService userService;
    private final ExportDataUtils exportDataUtils;

    @Autowired
    UserController(UserService userService, ExportDataUtils exportDataUtils) {
        this.userService = userService;
        this.exportDataUtils = exportDataUtils;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/export-user-data")
    public void exportUser(String role) throws IOException {
        exportDataUtils.exportUserWithSpecificRoleToCsv(role);
    }

    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User is not authenticated");
        }

        return userService.findByEmail(userDetails.getUsername());
    }

    @GetMapping("/welcome")
    public String test() {
        return "This endpoint is not secure, application is running on localhost!";
    }
}
