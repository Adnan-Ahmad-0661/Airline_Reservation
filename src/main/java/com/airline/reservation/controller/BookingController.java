package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation.dto.BookingResponse;
import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.User;
import com.airline.reservation.repository.UserRepository;
import com.airline.reservation.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")

// =====================================================
// LOGIN REQUIRED FOR ALL BOOKING APIs
// =====================================================

@PreAuthorize("isAuthenticated()")

public class BookingController {

	@Autowired
	private BookingService bookingService;

	@Autowired
	private UserRepository userRepository;

	// =====================================================
	// CREATE BOOKING
	// =====================================================

	@PostMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<?> createBooking(@RequestParam Long flightId, @RequestParam Long passengerId,
			@RequestParam String seatNumber,

			Authentication authentication) {

		try {

			// =================================================
			// AUTHENTICATION CHECK
			// =================================================

			if (authentication == null || !authentication.isAuthenticated()) {

				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login first to book a ticket.");
			}

			// =================================================
			// JWT USER EMAIL
			// =================================================

			String email = authentication.getName();
			// =================================================
			// FIND USER USING JWT EMAIL
			// =================================================

			User user = userRepository.findByEmail(email);

			if (user == null) {

				return ResponseEntity.status(404).body("Logged-in user not found.");
			}

			// =================================================
			// GET USER ID FROM DATABASE
			// =================================================

			Long userId = user.getId();

			// =================================================
			// CREATE BOOKING
			// =================================================

			Booking booking = bookingService.createBooking(userId, flightId, passengerId, seatNumber);

			// =================================================
			// SUCCESS
			// =================================================

			return ResponseEntity.ok(booking);

		} catch (RuntimeException e) {

			e.printStackTrace();

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// =====================================================
	// GET ALL BOOKINGS
	// =====================================================

	@GetMapping
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<List<BookingResponse>> getAllBookings() {

		return ResponseEntity.ok(bookingService.getAllBookings());
	}

	// =====================================================
	// GET MY BOOKINGS
	// =====================================================

	@GetMapping("/my")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<?> getMyBookings(Authentication authentication) {

		try {

			if (authentication == null || !authentication.isAuthenticated()) {

				return ResponseEntity.status(401).body("Please login first.");
			}

			String email = authentication.getName();

			Long userId = getUserIdByEmail(email);

			return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));

		} catch (RuntimeException e) {

			e.printStackTrace();

			return ResponseEntity.status(404).body(e.getMessage());
		}
	}

	// =====================================================
	// GET BOOKING BY ID
	// =====================================================

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {

		BookingResponse booking = bookingService.getBookingById(id);

		if (booking == null) {

			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(booking);
	}

	// =====================================================
	// GET BOOKING BY PNR
	// =====================================================

	@GetMapping("/pnr/{pnr}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<BookingResponse> getBookingByPnr(@PathVariable String pnr) {

		BookingResponse booking = bookingService.getBookingByPnr(pnr);

		if (booking == null) {

			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(booking);
	}

	// =====================================================
	// CANCEL BOOKING
	// =====================================================

	@PutMapping("/cancel/{bookingId}")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {

		try {

			System.out.println("CANCEL BOOKING ID: " + bookingId);

			Booking booking = bookingService.cancelBooking(bookingId);

			return ResponseEntity.ok(booking);

		} catch (RuntimeException e) {

			e.printStackTrace();

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// =====================================================
	// GET USER ID FROM JWT EMAIL
	// =====================================================

	private Long getUserIdByEmail(String email) {

		User user = userRepository.findByEmail(email);

		if (user == null) {

			throw new RuntimeException("USER NOT FOUND");
		}

		return user.getId();
	}
}