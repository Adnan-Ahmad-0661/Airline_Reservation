package com.airline.reservation.controller;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation.dto.LoginRequest;
import com.airline.reservation.dto.LoginResponse;
import com.airline.reservation.dto.ProfileResponse;
import com.airline.reservation.dto.RefreshTokenRequest;
import com.airline.reservation.entity.User;
import com.airline.reservation.repository.UserRepository;
import com.airline.reservation.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;


    // LOGIN
    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
        
    }


    // REFRESH TOKEN
@PostMapping("/refresh")
public ResponseEntity<?> refreshToken(
        @RequestBody RefreshTokenRequest request) {

    return authService.refreshToken(request.getRefreshToken());
}




    // LOGOUT / OFFLINE
    @PostMapping("/offline")
    public ResponseEntity<?> setOffline(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body("User is not authenticated");
        }

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email);

        if (user == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // User OFFLINE
        user.setOnline(false);

        userRepository.save(user);

        return ResponseEntity.ok(
                "User offline successfully"
        );
    }


    // MY PROFILE
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .build();
        }

        String email = authentication.getName();

		User user = userRepository.findByEmail(email);

        if (user == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Convert profile photo to Base64
        String profilePhoto = null;

        if (user.getProfilePhoto() != null
                && user.getProfilePhoto().length > 0) {

			profilePhoto = Base64.getEncoder().encodeToString(user.getProfilePhoto());
        }


        // Create profile response
        ProfileResponse profile = new ProfileResponse();

        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setPhone(user.getPhone());
        profile.setRole(user.getRole());
        profile.setOnline(user.isOnline());
        profile.setLoginTime(user.getLoginTime());
        profile.setProfilePhoto(profilePhoto);

        return ResponseEntity.ok(profile);
    }
}