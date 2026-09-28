package com.airline.reservation.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.airline.reservation.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    List<User> findByOnlineTrue();

    long countByOnlineTrue();

    
    
    @Modifying
    @Query("""
        UPDATE User u
        SET u.online = false
        WHERE u.online = true
        AND u.lastActive < :time
    """)
    void markUsersOffline(LocalDateTime time);
}