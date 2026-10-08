package com.example.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class MeController {
    public record MeResponse(Long id, String fullName, String email, String phone, LocalDateTime createdAt) {}

    private final UserRepository users;

    public MeController(UserRepository users) { this.users = users; }

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        User u = users.findByEmail(auth.getName())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return new MeResponse(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(), u.getCreatedAt());
    }
}