package com.airline.reservation.service;

import org.springframework.http.ResponseEntity;

import com.airline.reservation.dto.LoginRequest;
import com.airline.reservation.dto.LoginResponse;

public interface AuthService {
	 LoginResponse login(LoginRequest request);
	 
	 
	 ResponseEntity<LoginResponse> refreshToken(String refreshToken);
}
