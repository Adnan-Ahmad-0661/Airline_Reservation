package com.airline.reservation.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean online;
    private LocalDateTime loginTime;
    private LocalDateTime lastActive;
    private String profilePhoto;
}