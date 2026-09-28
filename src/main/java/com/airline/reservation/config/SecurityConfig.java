package com.airline.reservation.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.airline.reservation.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173",
                        "http://localhost:5174"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type"
                )
        );

        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

        // =================================================
        // CORS
        // =================================================

        .cors(cors ->
                cors.configurationSource(
                        corsConfigurationSource()
                )
        )

        // =================================================
        // CSRF
        // =================================================

        .csrf(csrf ->
                csrf.disable()
        )

        // =================================================
        // SESSION
        // =================================================

        .sessionManagement(session ->
                session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                )
        )

        // =================================================
        // AUTHORIZATION
        // =================================================

        .authorizeHttpRequests(auth -> auth

                // =================================================
                // SWAGGER
                // =================================================

                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**"
                ).permitAll()

                // =================================================
                // LOGIN
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/login"
                ).permitAll()

                // =================================================
                // REGISTER
                // =================================================

             // REGISTER
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/users"
                ).permitAll()

                // USER APIs
                .requestMatchers(
                        "/api/users/**"
                ).authenticated()
                // =================================================
                // CORS PREFLIGHT
                // =================================================

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()

                // =================================================
                // GET FLIGHTS
                // =================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/flights/**"
                ).permitAll()

                // =================================================
                // GET AIRPORTS
                // =================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/airports/**"
                ).permitAll()

                // =================================================
                // PROFILE
                // =================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/auth/profile"
                ).authenticated()

                // =================================================
                // OFFLINE / LOGOUT
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/offline"
                ).authenticated()

                // =================================================
                // ADD FLIGHT - ADMIN
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/flights/**"
                ).hasRole("ADMIN")

                // =================================================
                // UPDATE FLIGHT - ADMIN
                // =================================================

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/flights/**"
                ).hasRole("ADMIN")

                // =================================================
                // DELETE FLIGHT - ADMIN
                // =================================================

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/flights/**"
                ).hasRole("ADMIN")

                // =================================================
                // ADMIN APIs
                // =================================================

                .requestMatchers(
                        "/api/admin/**"
                ).hasRole("ADMIN")

                // =================================================
                // CREATE BOOKING
                // =================================================

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/bookings"
                ).hasAnyRole(
                        "USER",
                        "ADMIN"
                )

                // =================================================
                // GET BOOKINGS
                // =================================================

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/bookings/**"
                ).hasAnyRole(
                        "USER",
                        "ADMIN"
                )

                // =================================================
                // CANCEL BOOKING
                // =================================================

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/bookings/cancel/**"
                ).hasAnyRole(
                        "USER",
                        "ADMIN"
                )

                // =================================================
                // PASSENGER APIs
                // =================================================

                .requestMatchers(
                        "/api/passengers/**"
                ).hasAnyRole(
                        "USER",
                        "ADMIN"
                )

                // =================================================
                // USER APIs
                // =================================================

                .requestMatchers(
                        "/api/users/**"
                ).authenticated()

                // =================================================
                // TEST API
                // =================================================

                .requestMatchers(
                        "/api/test"
                ).authenticated()

                // =================================================
                // EVERYTHING ELSE
                // =================================================

                .anyRequest().authenticated()
        )

        // =====================================================
        // JWT FILTER
        // =====================================================

        .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}