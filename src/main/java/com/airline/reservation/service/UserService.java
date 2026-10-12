package com.airline.reservation.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.airline.reservation.dto.RegisterRequestDto;
import com.airline.reservation.dto.UserResponseDto;
import com.airline.reservation.entity.User;

public interface UserService {

    UserResponseDto addUser(
            RegisterRequestDto dto,
            MultipartFile photo
    );

    UserResponseDto getUserById(Long id);

    List<User> getAllUsers();

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    UserResponseDto updateProfilePhoto(
            Long id,
            MultipartFile photo
    );
    
    
}

