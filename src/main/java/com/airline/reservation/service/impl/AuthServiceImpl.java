
package com.airline.reservation.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.airline.reservation.dto.LoginRequest;
import com.airline.reservation.dto.LoginResponse;
import com.airline.reservation.entity.User;
import com.airline.reservation.repository.UserRepository;
import com.airline.reservation.security.JwtUtil;
import com.airline.reservation.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public LoginResponse login(LoginRequest request) {

		System.out.println("LOGIN EMAIL: " + request.getEmail());

		// =====================================================
		// FIND USER
		// =====================================================

		User user = userRepository.findByEmail(request.getEmail());

		if (user == null) {
			throw new RuntimeException("USER NOT FOUND");
		}

		// =====================================================
		// PASSWORD CHECK
		// =====================================================

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {

			throw new RuntimeException("WRONG PASSWORD");
		}

		// =====================================================
		// USER ONLINE
		// =====================================================

		LocalDateTime now = LocalDateTime.now();

		user.setOnline(true);

		// Current login time
		user.setLoginTime(now);

		// Last activity also starts from login time
		user.setLastActive(now);

		userRepository.save(user);

		// =====================================================
		// ACCESS TOKEN
		// =====================================================
		String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());
		// =====================================================
		// rEFRESH TOKEN
		// =====================================================
		String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

		// =====================================================
		// LOGIN RESPONSE
		// =====================================================

		return new LoginResponse(accessToken, refreshToken, user.getRole(), user.getId(), user.getName());
	}

	@Override
	public ResponseEntity<LoginResponse> refreshToken(String refreshToken) {

		try {
			if (refreshToken == null || refreshToken.isBlank()) {
				return ResponseEntity.status(401).build();
			}

			if (!jwtUtil.validateToken(refreshToken)) {
				return ResponseEntity.status(401).build();
			}

			if (!"REFRESH".equals(jwtUtil.getTokenType(refreshToken))) {
				return ResponseEntity.status(401).build();
			}

			String email = jwtUtil.getEmailFromToken(refreshToken);
			User user = userRepository.findByEmail(email);

			if (user == null) {
				return ResponseEntity.status(401).build();
			}

			// Do not reject refresh just because the presence
			// scheduler marked this user offline.
			String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole());

			LoginResponse response = new LoginResponse(newAccessToken, refreshToken, user.getRole(), user.getId(),
					user.getName());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			System.out.println("REFRESH TOKEN ERROR: " + e.getMessage());
			return ResponseEntity.status(401).build();
		}
	}

}
