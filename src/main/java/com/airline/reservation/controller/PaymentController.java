package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airline.reservation.entity.Payment;
import com.airline.reservation.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

	@Autowired
	private PaymentService paymentService;

	// MAKE PAYMENT
	@PostMapping
	public Payment makePayment(@RequestParam Long bookingId, @RequestParam String paymentMethod) {

		return paymentService.makePayment(bookingId, paymentMethod);
	}

	// GET ALL PAYMENTS
	@GetMapping
	public List<Payment> getAllPayments() {

		return paymentService.getAllPayments();
	}

	// GET PAYMENT BY ID
	@GetMapping("/{id}")
	public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {

		Payment payment = paymentService.getPaymentById(id);

		if (payment == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(payment);
	}

	// GET PAYMENT BY BOOKING
	@GetMapping("/booking/{bookingId}")
	public ResponseEntity<Payment> getPaymentByBookingId(@PathVariable Long bookingId) {

		Payment payment = paymentService.getPaymentByBookingId(bookingId);

		if (payment == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(payment);
	}
}