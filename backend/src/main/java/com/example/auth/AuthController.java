package com.example.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record RegisterRequest(
        @NotBlank(message = "Enter your full name") @Size(max = 100) String fullName,
        @NotBlank(message = "Enter your email") @Email(message = "Enter a valid email") String email,
        @NotBlank(message = "Enter your phone number")
        @Pattern(regexp = "^[0-9+\\-\\s]{10,15}$", message = "Enter a valid phone number") String phone,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password) {}

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}

    public record ResetRequest(
        @NotBlank(message = "Enter your email") @Email(message = "Enter a valid email") String email,
        @NotBlank(message = "Enter your phone number") String phone,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password) {}

    public record UserResponse(Long id, String fullName, String email, String phone) {}

    public record AuthResponse(String token, UserResponse user) {}

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getPhone());
    }

    private String digits(String s) {
        return s == null ? "" : s.replaceAll("[^0-9]", "");
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        User u = new User();
        u.setFullName(req.fullName().trim());
        u.setEmail(email);
        u.setPhone(req.phone().trim());
        u.setPassword(encoder.encode(req.password()));
        users.save(u);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new AuthResponse(jwt.generate(email), toResponse(u)));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        User u = users.findByEmail(req.email().trim().toLowerCase())
            .filter(x -> encoder.matches(req.password(), x.getPassword()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect"));
        return new AuthResponse(jwt.generate(u.getEmail()), toResponse(u));
    }

    // Forgot password: email + phone must match the account, then the new password is saved.
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetRequest req) {
        User u = users.findByEmail(req.email().trim().toLowerCase())
            .filter(x -> !digits(x.getPhone()).isEmpty() && digits(x.getPhone()).equals(digits(req.phone())))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Email and phone number do not match our records"));
        u.setPassword(encoder.encode(req.password()));
        users.save(u);
        return Map.of("message", "Password updated");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> invalid(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getDefaultMessage()).findFirst().orElse("Invalid input");
        return ResponseEntity.badRequest().body(Map.of("message", msg));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> status(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", ex.getReason()));
    }
}