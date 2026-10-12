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

	// Access Token = 15 minutes
	private final long ACCESS_TOKEN_EXPIRATION = 1000L * 60 * 15;

	// Refresh Token = 7 days
	private final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7;


    // =========================
    // ACCESS TOKEN
    // =========================
	public String generateAccessToken(String email, String role) {

		return Jwts.builder().setSubject(email).claim("role", role).claim("type", "ACCESS").setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
				.signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
				.compact();
	}


    // =========================
    // REFRESH TOKEN
    // =========================
	public String generateRefreshToken(String email) {

		return Jwts.builder().setSubject(email).claim("type", "REFRESH").setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
				.signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
				.compact();
	}


    // =========================
    // GET CLAIMS
    // =========================
    public Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(
                        Keys.hmacShaKeyFor(
                                SECRET_KEY.getBytes(
                                        StandardCharsets.UTF_8
                                )
                        )
                )
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    // =========================
    // GET EMAIL
    // =========================
    public String getEmailFromToken(
            String token) {

        return getClaims(token)
                .getSubject();
    }


    // =========================
    // GET ROLE
    // =========================
    public String getRoleFromToken(
            String token) {

        return getClaims(token)
                .get("role", String.class);
    }


    // =========================
    // GET TOKEN TYPE
    // =========================
	public String getTokenType(String token) {

		return getClaims(token).get("type", String.class);
	}

    // =========================
    // VALIDATE TOKEN
    // =========================
    public boolean validateToken(
            String token) {

        try {

            getClaims(token);

            return true;

        } catch (Exception e) {

            System.out.println(
                    "JWT VALIDATION ERROR: "
                            + e.getMessage()
            );

            return false;
        }
    }
}