package com.airline.reservation.controller;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/render")
public class LiveController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public String live() {
        return "Application is Live!";
    }

    // Every 1 minute
    @Scheduled(fixedRate = 60000)
    public void keepAlive() {
        try {
            restTemplate.getForObject(
                "https://airline-reservation-n7d4.onrender.com/render",
                String.class
            );
            System.out.println("Render ping sent.");
        } catch (Exception e) {
            System.out.println("Ping failed: " + e.getMessage());
        }
    }
}