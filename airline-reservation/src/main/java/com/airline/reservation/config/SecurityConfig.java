package com.airline.reservation.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
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

import lombok.Data;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
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

        configuration.setAllowCredentials(true);

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

       

        // =================================================
        // CORS
        // =================================================
    	 http
        .cors()
        .and()

        // =================================================
        // CSRF
        // =================================================

        .csrf()
        .disable()

        // =================================================
        // SESSION
        // =================================================

        .sessionManagement()
        .sessionCreationPolicy(
                SessionCreationPolicy.STATELESS
        )

        .and()

        // =================================================
        // AUTHORIZATION
        // =================================================

        .authorizeRequests()

        // =================================================
        // SWAGGER
        // =================================================

        .antMatchers(
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/v3/api-docs/**"
        ).permitAll()

        // =================================================
        // LOGIN
        // =================================================

        .antMatchers(
                "/api/auth/login"
        ).permitAll()

        // =================================================
        // CREATE USER
        // =================================================

        .antMatchers(
                HttpMethod.POST,
                "/api/users"
        ).permitAll()

        // =================================================
        // CORS PREFLIGHT
        // =================================================

        .antMatchers(
                HttpMethod.OPTIONS,
                "/**"
        ).permitAll()

        // =================================================
        // GET FLIGHTS
        // =================================================

        .antMatchers(
                HttpMethod.GET,
                "/api/flights/**"
        ).permitAll()

        // =================================================
        // GET AIRPORTS
        // =================================================

        .antMatchers(
                HttpMethod.GET,
                "/api/airports/**"
        ).permitAll()

        // =================================================
        // ADD FLIGHT - ADMIN
        // =================================================

        .antMatchers(
                HttpMethod.POST,
                "/api/flights/**"
        ).hasRole("ADMIN")

        // =================================================
        // UPDATE FLIGHT - ADMIN
        // =================================================

        .antMatchers(
                HttpMethod.PUT,
                "/api/flights/**"
        ).hasRole("ADMIN")

        // =================================================
        // DELETE FLIGHT - ADMIN
        // =================================================

        .antMatchers(
                HttpMethod.DELETE,
                "/api/flights/**"
        ).hasRole("ADMIN")

        // =================================================
        // ADMIN APIs
        // =================================================

        .antMatchers(
                "/api/admin/**"
        ).hasRole("ADMIN")

        // =================================================
        // CREATE BOOKING
        // =================================================

        .antMatchers(
                HttpMethod.POST,
                "/api/bookings"
        ).hasAnyRole(
                "USER",
                "ADMIN"
        )

        // =================================================
        // GET BOOKINGS
        // =================================================

        .antMatchers(
                HttpMethod.GET,
                "/api/bookings/**"
        ).hasAnyRole(
                "USER",
                "ADMIN"
        )

        // =================================================
        // CANCEL BOOKING
        // =================================================

        .antMatchers(
                HttpMethod.PUT,
                "/api/bookings/cancel/**"
        ).hasAnyRole(
                "USER",
                "ADMIN"
        )

        // =================================================
        // PASSENGER APIs
        // =================================================

        .antMatchers(
                "/api/passengers/**"
        ).hasAnyRole(
                "USER",
                "ADMIN"
        )

        // =================================================
        // USER APIs
        // =================================================

        .antMatchers(
                "/api/users/**"
        ).authenticated()

        // =================================================
        // TEST API
        // =================================================

        .antMatchers(
                "/api/test"
        ).authenticated()

        // =================================================
        // EVERYTHING ELSE
        // =================================================

        .anyRequest()
        .authenticated()

        .and()

        // =================================================
        // JWT FILTER
        // =================================================

        .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}