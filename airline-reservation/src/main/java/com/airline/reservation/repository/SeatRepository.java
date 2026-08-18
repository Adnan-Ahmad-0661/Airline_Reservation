package com.airline.reservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation.entity.Flight;
import com.airline.reservation.entity.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlight(Flight flight);

    Seat findByFlightAndSeatNumber(
            Flight flight,
            String seatNumber);

    void deleteByFlightId(Long flightId);
}