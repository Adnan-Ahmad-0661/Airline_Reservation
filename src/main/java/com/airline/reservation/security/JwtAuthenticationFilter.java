package com.airline.reservation.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.airline.reservation.entity.User;
import com.airline.reservation.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =========================================
        // CORS PREFLIGHT REQUEST
        // =========================================

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // REQUEST PATH
        // =========================================

        String path = request.getRequestURI();

        System.out.println("REQUEST PATH: " + path);

        // =========================================
        // SWAGGER REQUEST
        // =========================================

        if (path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.equals("/swagger-ui.html")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // LOGIN REQUEST
        // =========================================

        if (path.equals("/api/auth/login")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // REFRESH TOKEN REQUEST
        // IMPORTANT
        // Expired ACCESS token hone par bhi
        // refresh endpoint chalna chahiye.
        // =========================================

        if (path.equals("/api/auth/refresh")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // GET JWT TOKEN
        // =========================================

        String authHeader =
                request.getHeader("Authorization");

        // =========================================
        // NO TOKEN
        // =========================================

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // EXTRACT TOKEN
        // =========================================

        String token =
                authHeader.substring(7);

        // =========================================
        // VALIDATE JWT
        // =========================================

        if (!jwtUtil.validateToken(token)) {

            System.out.println(
                    "JWT TOKEN INVALID"
            );

            filterChain.doFilter(request, response);
            return;
        }

        System.out.println(
                "JWT TOKEN VALID"
        );

        // =========================================
        // CHECK TOKEN TYPE
        // Only ACCESS token can access APIs
        // =========================================

        String tokenType =
                jwtUtil.getTokenType(token);

        System.out.println(
                "JWT TOKEN TYPE: " + tokenType
        );

        if (!"ACCESS".equals(tokenType)) {

            System.out.println(
                    "INVALID TOKEN TYPE"
            );

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // GET USER INFORMATION FROM TOKEN
        // =========================================

        String email =
                jwtUtil.getEmailFromToken(token);

        String role =
                jwtUtil.getRoleFromToken(token);


        // =========================================
        // GET USER FROM DATABASE
        // =========================================

        User user =
                userRepository.findByEmail(email);

        // =========================================
        // USER NOT FOUND
        // =========================================

        if (user == null) {

            System.out.println(
                    "USER NOT FOUND IN DATABASE"
            );

            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );

            response.getWriter().write(
                    "{\"message\":\"User not found\"}"
            );

            return;
        }

        // =========================================
        // CHECK ONLINE STATUS
        // =========================================

        if (!user.isOnline()) {

            System.out.println(
                    "USER IS OFFLINE - ACCESS DENIED: "
                            + email
            );

            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );

            response.getWriter().write(
                    "{\"message\":\"User is offline. Please login again.\"}"
            );

            return;
        }

        // =========================================
        // CREATE AUTHORITY
        // =========================================

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" + role
                );

        // =========================================
        // CREATE AUTHENTICATION
        // =========================================

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        Collections.singletonList(
                                authority
                        )
                );

        // =========================================
        // SET SECURITY CONTEXT
        // =========================================

        SecurityContextHolder
                .getContext()
                .setAuthentication(
                        authentication
                );

        System.out.println(
                "AUTHENTICATION SET FOR: "
                        + email
        );

        // =========================================
        // CONTINUE FILTER CHAIN
        // =========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}