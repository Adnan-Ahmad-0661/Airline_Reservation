package com.airline.reservation.scheduler;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.airline.reservation.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OnlineUserScheduler {

    private final UserRepository userRepository;

    @Transactional
    @Scheduled(fixedRate = 60000)
    public void markOfflineUsers() {

        LocalDateTime time =
                LocalDateTime.now().minusMinutes(5);

        userRepository.markUsersOffline(time);
    }
}