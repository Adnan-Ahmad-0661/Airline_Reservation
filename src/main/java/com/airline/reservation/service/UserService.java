package com.airline.reservation.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.airline.reservation.dto.UserResponse;
import com.airline.reservation.entity.User;

public interface UserService {

    UserResponse addUser(
            User user,
            MultipartFile photo
    );

    UserResponse getUserById(Long id);

    List<User> getAllUsers();

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    UserResponse updateProfilePhoto(
            Long id,
            MultipartFile photo
    );
}

