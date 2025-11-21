package com.springweb.core.service;

import com.springweb.core.dto.UserRegisterDto;
import com.springweb.core.entity.Role;
import com.springweb.core.entity.User;
import com.springweb.core.repository.RoleRepository;
import com.springweb.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void registerUser(UserRegisterDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        Role role = roleRepository.findByName("ROLE_VOLUNTEER")
                .orElseThrow(() -> new IllegalStateException("Cannot find role volunteer by default"));

        User user = User.builder()
                .email(dto.getEmail())
                .fullName(dto.getFullName())
                .phoneNumber(dto.getPhoneNumber())
                .password(encoder.encode(dto.getPassword()))
                .role(role)
                .status(User.UserStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();

        userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.getByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public void lockUserByEmail(String email) {
        User user = findByEmail(email);
        user.setStatus(User.UserStatus.LOCKED);
        userRepository.save(user);
    }

    public void unlockUserByEmail(String email) {
        User user = findByEmail(email);
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);
    }

    public void changeUserRole(String email, String roleName) {
        User user = findByEmail(email);
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Role not found: " + roleName));
        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.getByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().getName())
                .accountLocked(user.getStatus() != null && user.getStatus() == User.UserStatus.LOCKED)
                .build();
    }
}
