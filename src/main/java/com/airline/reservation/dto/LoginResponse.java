package com.airline.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;

    private String refreshToken;

    private String role;

    private Long userId;

    private String name;
}