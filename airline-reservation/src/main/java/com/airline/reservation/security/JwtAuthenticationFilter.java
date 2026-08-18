package com.airline.reservation.security;

import java.io.IOException;
import java.util.Collections;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

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

            System.out.println("OPTIONS REQUEST - CORS PREFLIGHT");

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // GET REQUEST PATH
        // =========================================

        String path = request.getRequestURI();

        // =========================================
        // SWAGGER REQUEST
        // =========================================

        if (path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.equals("/swagger-ui.html")) {

            System.out.println("SWAGGER REQUEST - JWT SKIPPED");

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // GET JWT TOKEN
        // =========================================

        String authHeader = request.getHeader("Authorization");

        System.out.println("AUTH HEADER: " + authHeader);

        // =========================================
        // NO TOKEN
        // =========================================

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("NO JWT TOKEN FOUND");

            filterChain.doFilter(request, response);
            return;
        }

        // =========================================
        // EXTRACT TOKEN
        // =========================================

        String token = authHeader.substring(7);

        System.out.println("JWT TOKEN FOUND");

        // =========================================
        // VALIDATE TOKEN
        // =========================================

        if (jwtUtil.validateToken(token)) {

            System.out.println("JWT TOKEN VALID");

            String email = jwtUtil.getEmailFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);

            System.out.println("EMAIL FROM TOKEN: " + email);
            System.out.println("ROLE FROM TOKEN: " + role);

            // =========================================
            // CREATE AUTHORITY
            // =========================================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority("ROLE_" + role);

            // =========================================
            // CREATE AUTHENTICATION
            // =========================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(authority)
                    );

            // =========================================
            // SET SECURITY CONTEXT
            // =========================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "AUTHENTICATION SET: "
                            + SecurityContextHolder
                                    .getContext()
                                    .getAuthentication()
            );

        } else {

            System.out.println("JWT TOKEN INVALID");
        }

        // =========================================
        // CONTINUE FILTER CHAIN
        // =========================================

        filterChain.doFilter(request, response);
    }
}