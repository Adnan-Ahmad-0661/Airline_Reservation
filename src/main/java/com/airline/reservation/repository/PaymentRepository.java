
package com.airline.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airline.reservation.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findFirstByBookings_Id(Long bookingId);
}
