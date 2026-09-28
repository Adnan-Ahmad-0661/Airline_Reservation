package com.airline.reservation.service;

import java.util.List;

import com.airline.reservation.entity.Payment;

public interface PaymentService {

    Payment makePayment(
            Long bookingId,
            String paymentMethod);

    Payment getPaymentById(Long id);

    Payment getPaymentByBookingId(Long bookingId);

    List<Payment> getAllPayments();
    
}
