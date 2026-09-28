package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation.dto.OnlineUserResponse;
import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.Flight;
import com.airline.reservation.entity.Payment;
import com.airline.reservation.entity.Ticket;
import com.airline.reservation.entity.User;
import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.FlightRepository;
import com.airline.reservation.repository.PaymentRepository;
import com.airline.reservation.repository.TicketRepository;
import com.airline.reservation.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

	
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private FlightRepository flightRepository;

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private TicketRepository ticketRepository;

	// ALL USERS
	@GetMapping("/users")
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	// ALL FLIGHTS
	@GetMapping("/flights")
	public List<Flight> getAllFlights() {
		return flightRepository.findAll();
	}

	// ALL BOOKINGS
	@GetMapping("/bookings")
	public List<Booking> getAllBookings() {
		return bookingRepository.findAll();
		
	}

	// ALL PAYMENTS
	@GetMapping("/payments")
	public List<Payment> getAllPayments() {
		return paymentRepository.findAll();
	}

	// ALL TICKETS
	@GetMapping("/tickets")
	public List<Ticket> getAllTickets() {
		return ticketRepository.findAll();
	}
//	Get-online User

//	@GetMapping("/users-status")
//	public List<OnlineUserResponse> getOnlineUsers() {
//
//	    DateTimeFormatter dateFormatter =
//	            DateTimeFormatter.ofPattern("dd-MM-yyyy");
//
//	    DateTimeFormatter timeFormatter =
//	            DateTimeFormatter.ofPattern("hh:mm a");

//	    return userRepository.findAll()
//	            .stream()
//	            .map(user -> new OnlineUserResponse(
//
//	                    user.getId(),
//	                    user.getName(),
//	                    user.getEmail(),
//	                    user.getRole(),
//
//	                    // STATUS
//	                    user.isOnline()
//	                            ? "Online"
//	                            : user.getLastActive() != null
//	                                ? "Last active\n"
//	                                    + user.getLastActive().format(dateFormatter)
//	                                    + "\n"
//	                                    + user.getLastActive().format(timeFormatter)
//	                                : "OffLine",
//
//	                    
//	                    user.getLastActive()
//	            ))
//	            .toList();
	
	@GetMapping("/users-status")
	public List<OnlineUserResponse> getOnlineUsers() {

	    return userRepository.findAll()
	            .stream()
	            .map(user -> new OnlineUserResponse(
	                    user.getId(),
	                    user.getName(),
	                    user.getEmail(),
	                    user.getPhone(),
	                    user.getRole(),
	                    user.isOnline() ? "Online" : "Offline",
	                    user.getLastActive()
	            ))
	            .toList();

	
	}
	
	
	 // =========================
    // EDIT USER / ADMIN
    // =========================

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User user = userRepository
                .findById(id)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found of given id "+id);
        }


        // Name
        if (updatedUser.getName() != null) {
			user.setName(updatedUser.getName());
        }


        // Email
		if (updatedUser.getEmail() != null && !updatedUser.getEmail().isBlank()) {

			user.setEmail(updatedUser.getEmail());
		}


        // Phone
        if (updatedUser.getPhone() != null) {
			user.setPhone(updatedUser.getPhone());
        }


        // Role
        if (updatedUser.getRole() != null
                && !updatedUser.getRole().isBlank()) {

            String role =
                    updatedUser.getRole()
                            .replace("ROLE_", "")
                            .toUpperCase();

            if (!role.equals("USER")
                    && !role.equals("ADMIN")) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Role must be USER or ADMIN"
                        );
            }

            user.setRole(role);
        }


		User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }


    // =========================
    // DELETE USER / ADMIN
    // =========================

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        User user = userRepository
                .findById(id)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found of given id : "+id);
        }


        userRepository.delete(user);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }

}