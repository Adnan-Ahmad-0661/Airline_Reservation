package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airline.reservation.dto.UserResponse;
import com.airline.reservation.entity.User;
import com.airline.reservation.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

	@Autowired
	private UserService userService;

	// ADD USER
	@PostMapping
	public UserResponse addUser(@RequestBody User user) {

		return userService.addUser(user);
	}

	// GET ALL USERS
	@GetMapping
	public List<User> getAllUsers() {

		return userService.getAllUsers();
	}

	// GET USER BY ID
	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {

		UserResponse user = userService.getUserById(id);

		if (user == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(user);
	}

	// UPDATE USER
	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {

		User updatedUser = userService.updateUser(id, user);

		if (updatedUser == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(updatedUser);
	}

	// DELETE USER
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {

		userService.deleteUser(id);

		return ResponseEntity.ok("User deleted successfully");
	}
}