package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}