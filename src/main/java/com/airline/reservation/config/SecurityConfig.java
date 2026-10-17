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

	// PASSWORD ENCODER

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {

		CorsConfiguration configuration = new CorsConfiguration();

		configuration.setAllowedOrigins(Arrays.asList("https://airline-front-end.vercel.app", "http://localhost:5173"));

		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

		configuration.setAllowCredentials(false);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

	// SECURITY FILTER CHAIN


@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())

        // H2 Console permission
        .headers(headers ->
            headers.frameOptions(frame -> frame.disable())
        )

        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests(auth -> auth

            // H2 Console
            .requestMatchers("/h2-console/**").permitAll()

            .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()

            .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/users").permitAll()

            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            .requestMatchers(HttpMethod.GET, "/api/flights/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/airports/**").permitAll()

            .requestMatchers(HttpMethod.GET, "/api/auth/profile").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/auth/offline").authenticated()

            .requestMatchers(HttpMethod.POST, "/api/flights/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/flights/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/flights/**").hasRole("ADMIN")
            .requestMatchers("/api/admin/**").hasRole("ADMIN")

            .requestMatchers(HttpMethod.POST, "/api/bookings").hasAnyRole("USER", "ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/bookings/**").hasAnyRole("USER", "ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/bookings/cancel/**").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/api/passengers/**").hasAnyRole("USER", "ADMIN")

            .requestMatchers("/api/users/**").authenticated()
            .requestMatchers("/api/test").authenticated()

            .anyRequest().authenticated()
        )

        .addFilterBefore(jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

}