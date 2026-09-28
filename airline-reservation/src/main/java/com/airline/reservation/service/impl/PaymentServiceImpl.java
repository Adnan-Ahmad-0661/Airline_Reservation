package com.airline.reservation.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.Payment;
import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.PaymentRepository;
import com.airline.reservation.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Payment makePayment(
            Long bookingId,
            String paymentMethod) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"));

        // Check existing payment
        Payment existingPayment =
                paymentRepository
                        .findByBookingId(bookingId);

        if (existingPayment != null) {

            throw new RuntimeException(
                    "Payment already exists for this booking");
        }

        Payment payment = new Payment();

        payment.setBooking(booking);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setAmount(
                booking.getAmount());

        payment.setPaymentMethod(
                paymentMethod);

        payment.setPaymentStatus(
                "SUCCESS");

        Random random = new Random();

        int number = 100000 + random.nextInt(900000);

        payment.setTransactionId("TXN-" + number);

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentById(Long id) {

        return paymentRepository
                .findById(id)
                .orElse(null);
    }

    @Override
    public Payment getPaymentByBookingId(
            Long bookingId) {

        return paymentRepository
                .findByBookingId(bookingId);
    }

    @Override
    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }
}