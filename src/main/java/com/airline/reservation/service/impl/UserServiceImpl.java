package com.airline.reservation.service.impl;

import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.airline.reservation.dto.UserResponse;
import com.airline.reservation.entity.User;
import com.airline.reservation.repository.UserRepository;
import com.airline.reservation.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


    // ADD USER
    @Override
    public UserResponse addUser(User user, MultipartFile photo) {

        User existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            throw new RuntimeException("User Already exist");
        }

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        // Default role
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // New user offline
        user.setOnline(false);

        // Save profile photo
        if (photo != null && !photo.isEmpty()) {

            try {
                user.setProfilePhoto(photo.getBytes());

            } catch (Exception e) {
                throw new RuntimeException(
                        "Failed to upload profile photo",
                        e
                );
            }
        }

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }


    // GET USER BY ID
    @Override
    public UserResponse getUserById(Long id) {

        User user =
                userRepository.findById(id)
                        .orElse(null);

        if (user == null) {
            return null;
        }

        return convertToResponse(user);
    }


    // GET ALL USERS
    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // UPDATE USER
    @Override
    public User updateUser(Long id, User user) {

        User existingUser =
                userRepository.findById(id)
                        .orElse(null);

        if (existingUser == null) {
            return null;
        }

        existingUser.setEmail(user.getEmail());
        existingUser.setName(user.getName());
        existingUser.setPhone(user.getPhone());
        existingUser.setRole(user.getRole());

        // Existing password preserve
        // Existing profile photo preserve

        return userRepository.save(existingUser);
    }


    // DELETE USER
    @Override
    public void deleteUser(Long id) {

        userRepository.deleteById(id);
    }


    // CHANGE / ADD PROFILE PHOTO
    @Override
    public UserResponse updateProfilePhoto(
            Long id,
            MultipartFile photo) {

        User user =
                userRepository.findById(id)
                        .orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (photo == null || photo.isEmpty()) {
            throw new RuntimeException(
                    "Please select a photo"
            );
        }

        try {

            // Replace old photo with new photo
            user.setProfilePhoto(
                    photo.getBytes()
            );

            // Save photo permanently in database
            User savedUser =
                    userRepository.save(user);

            return convertToResponse(savedUser);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to update profile photo",
                    e
            );
        }
    }


    // USER → RESPONSE
    private UserResponse convertToResponse(User user) {

        UserResponse response =
                new UserResponse();

        response.setId(user.getId());

        response.setEmail(user.getEmail());

        response.setName(user.getName());

        response.setPhone(user.getPhone());

        response.setRole(user.getRole());


        // Convert photo to Base64
        if (user.getProfilePhoto() != null
                && user.getProfilePhoto().length > 0) {

            String base64 =
                    Base64.getEncoder()
                            .encodeToString(
                                    user.getProfilePhoto()
                            );

            response.setProfilePhoto(base64);

        } else {

            response.setProfilePhoto(null);
        }

        return response;
    }
}
