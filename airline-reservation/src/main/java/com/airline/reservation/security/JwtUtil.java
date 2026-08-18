package com.airline.reservation.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String SECRET_KEY = "airlineReservationSecretKeyForJwt2026";

	private final long EXPIRATION_TIME = 1000L * 60 * 60; // 1 hour

	public String generateToken(String email, String role) {

		return Jwts.builder().setSubject(email).claim("role", role).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
				.compact();
	}

	public Claims getClaims(String token) {

		return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)))
				.build().parseClaimsJws(token).getBody();
	}

	public String getEmailFromToken(String token) {
		return getClaims(token).getSubject();
	}

	public String getRoleFromToken(String token) {
		return getClaims(token).get("role", String.class);
	}

	public boolean validateToken(String token) {

		try {
			getClaims(token);
			return true;
		} catch (Exception e) {
			System.out.println("JWT VALIDATION ERROR: " + e.getMessage());
			return false;
		}
	}
}