package com.example.auth;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;
    @Column(nullable = false, unique = true, length = 150)
    private String email;
    @Column(length = 20)
    private String phone;
    @Column(nullable = false, length = 100)
    private String password;
    @Column(name = "reset_token", length = 100)
    private String resetToken;
    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { this.fullName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }
    public String getResetToken() { return resetToken; }
    public void setResetToken(String v) { this.resetToken = v; }
    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(LocalDateTime v) { this.resetTokenExpiry = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}