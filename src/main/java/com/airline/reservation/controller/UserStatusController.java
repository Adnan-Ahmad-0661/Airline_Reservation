package com.airline.reservation.controller;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation.entity.User;
import com.airline.reservation.repository.UserRepository;
import com.airline.reservation.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user-status")
@CrossOrigin
@RequiredArgsConstructor
public class UserStatusController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/offline")
    public String markOffline(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {
            return "Invalid token";
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            return "Invalid token";
        }

        String email = jwtUtil.getEmailFromToken(token);

        User user = userRepository.findByEmail(email);

        if (user != null) {
            user.setOnline(false);
            user.setLastActive(LocalDateTime.now());
            userRepository.save(user);
        }

        return "User offline";
    }
}