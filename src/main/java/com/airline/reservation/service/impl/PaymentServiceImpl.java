
package com.airline.reservation.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.Payment;
import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.PaymentRepository;
import com.airline.reservation.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    private static final Set<String> PAYMENT_METHODS = Set.of(
            "UPI", "CARD", "NET_BANKING", "WALLET", "COUNTER"
    );

    private static final Set<String> UPI_APPS = Set.of(
            "Google Pay", "PhonePe", "Paytm"
    );

    @Override
    @Transactional
    public Payment makePayment(
            List<Long> bookingIds,
            String paymentMethod,
            String upiApp) {

        if (bookingIds == null || bookingIds.isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one booking ID is required");
        }

        if (bookingIds.stream().anyMatch(id -> id == null || id <= 0)) {
            throw new IllegalArgumentException(
                    "Invalid booking ID");
        }

        if (new HashSet<>(bookingIds).size() != bookingIds.size()) {
            throw new IllegalArgumentException(
                    "Duplicate booking IDs are not allowed");
        }

        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new IllegalArgumentException(
                    "Payment method is required");
        }

        String method = paymentMethod.trim().toUpperCase();

        if (!PAYMENT_METHODS.contains(method)) {
            throw new IllegalArgumentException(
                    "Invalid payment method");
        }

        String selectedUpiApp = null;

        if ("UPI".equals(method)) {
            if (upiApp == null || !UPI_APPS.contains(upiApp.trim())) {
                throw new IllegalArgumentException(
                        "Select Google Pay, PhonePe or Paytm");
            }

            selectedUpiApp = upiApp.trim();
        }

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("Please log in to make payment");
        }

        String loggedInEmail = authentication.getName();

        List<Booking> bookings = new ArrayList<>();
        double totalAmount = 0.0;

        for (Long bookingId : bookingIds) {

            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Booking not found: " + bookingId));

            // Prevent paying for another user's booking.
            if (booking.getUser() == null
                    || booking.getUser().getEmail() == null
                    || !loggedInEmail.equalsIgnoreCase(
                            booking.getUser().getEmail())) {
                throw new RuntimeException(
                        "You are not authorized to pay for this booking");
            }

            // Prevent creating a second payment for a booking.
            if (paymentRepository.findFirstByBookings_Id(bookingId) != null) {
                throw new RuntimeException(
                        "Payment already exists for booking: " + bookingId);
            }

            if (booking.getAmount() == null
                    || booking.getAmount() <= 0) {
                throw new IllegalArgumentException(
                        "Invalid amount for booking: " + bookingId);
            }

            if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
                throw new IllegalArgumentException(
                        "Cannot pay for a cancelled booking");
            }

            totalAmount += booking.getAmount();
            bookings.add(booking);
        }

        Payment payment = new Payment();
        payment.setBookings(bookings);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(method);
        payment.setUpiApp(selectedUpiApp);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus("PENDING");
        payment.setTransactionId("TXN-" + UUID.randomUUID());

        // Save payment first to obtain its ID.
        Payment savedPayment = paymentRepository.save(payment);

        // Booking is the owning side of the relationship.
        for (Booking booking : bookings) {
            booking.setPayment(savedPayment);
        }

        bookingRepository.saveAll(bookings);

        return savedPayment;
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Override
    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findFirstByBookings_Id(bookingId);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
