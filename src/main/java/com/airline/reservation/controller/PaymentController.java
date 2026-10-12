
package com.airline.reservation.controller;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation.entity.Payment;
import com.airline.reservation.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    private static final Set<String> PAYMENT_METHODS = Set.of(
            "UPI",
            "CARD",
            "NET_BANKING",
            "WALLET",
            "COUNTER"
    );

    private static final Set<String> UPI_APPS = Set.of(
            "Google Pay",
            "PhonePe",
            "Paytm"
    );

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // CREATE ONE PAYMENT FOR MULTIPLE BOOKINGS
    @PostMapping
    public ResponseEntity<?> makePayment(
            @RequestParam List<Long> bookingIds,
            @RequestParam String paymentMethod,
            @RequestParam(required = false) String upiApp) {

        if (bookingIds == null || bookingIds.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("At least one booking ID is required.");
        }

        if (paymentMethod == null || paymentMethod.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Payment method is required.");
        }

        String method = paymentMethod.trim().toUpperCase();

        if (!PAYMENT_METHODS.contains(method)) {
            return ResponseEntity.badRequest()
                    .body("Unsupported payment method.");
        }

        String selectedUpiApp = null;

        if ("UPI".equals(method)) {
            if (upiApp == null || !UPI_APPS.contains(upiApp.trim())) {
                return ResponseEntity.badRequest()
                        .body("Select Google Pay, PhonePe, or Paytm.");
            }

            selectedUpiApp = upiApp.trim();
        }

        try {
            Payment payment = paymentService.makePayment(
                    bookingIds,
                    method,
                    selectedUpiApp
            );

            return ResponseEntity.ok(payment);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // GET ALL PAYMENTS
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // GET PAYMENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);

        if (payment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(payment);
    }

    // GET PAYMENT BY BOOKING ID
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBookingId(
            @PathVariable Long bookingId) {

        Payment payment =
                paymentService.getPaymentByBookingId(bookingId);

        if (payment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(payment);
    }
}
