package com.airline.reservation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airline.reservation.entity.Flight;
import com.airline.reservation.entity.Seat;
import com.airline.reservation.repository.FlightRepository;
import com.airline.reservation.repository.SeatRepository;
import com.airline.reservation.service.SeatService;

@Service
public class SeatServiceImpl implements SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private FlightRepository flightRepository;

    // =====================================================
    // ADD SEAT
    // =====================================================

    @Override
    public Seat addSeat(Long flightId, Seat seat) {

        Flight flight = flightRepository
                .findById(flightId)
                .orElse(null);

        if (flight == null) {
            throw new RuntimeException(
                    "Flight not found"
            );
        }

        Seat existingSeat =
                seatRepository.findByFlightAndSeatNumber(
                        flight,
                        seat.getSeatNumber()
                );

        if (existingSeat != null) {
            throw new RuntimeException(
                    "Seat already exists"
            );
        }

        seat.setFlight(flight);

        seat.setStatus("AVAILABLE");

        // Seat class automatically determine
        seat.setSeatClass(
                getSeatClass(
                        seat.getSeatNumber()
                )
        );

        return seatRepository.save(seat);
    }

    // =====================================================
    // GET SEATS BY FLIGHT
    // =====================================================

    @Override
    public List<Seat> getSeatsByFlight(Long flightId) {

        Flight flight = flightRepository
                .findById(flightId)
                .orElse(null);

        if (flight == null) {
            throw new RuntimeException(
                    "Flight not found"
            );
        }

        return seatRepository.findByFlight(flight);
    }

    // =====================================================
    // GET SEAT BY ID
    // =====================================================

    @Override
    public Seat getSeatById(Long id) {

        return seatRepository
                .findById(id)
                .orElse(null);
    }

    // =====================================================
    // UPDATE SEAT
    // =====================================================

    @Override
    public Seat updateSeat(Long id, Seat seat) {

        Seat existingSeat =
                seatRepository.findById(id)
                        .orElse(null);

        if (existingSeat == null) {
            return null;
        }

        existingSeat.setSeatNumber(
                seat.getSeatNumber()
        );

        existingSeat.setSeatClass(
                getSeatClass(
                        seat.getSeatNumber()
                )
        );

        existingSeat.setStatus(
                seat.getStatus()
        );

        return seatRepository.save(
                existingSeat
        );
    }

    // =====================================================
    // DELETE SEAT
    // =====================================================

    @Override
    public void deleteSeat(Long id) {

        seatRepository.deleteById(id);
    }

    // =====================================================
    // DETERMINE SEAT CLASS
    // =====================================================

    private String getSeatClass(
            String seatNumber) {

        if (seatNumber == null ||
                seatNumber.trim().isEmpty()) {

            throw new RuntimeException(
                    "Seat number is required"
            );
        }

        // Example: 1A, 6D, 10A, 13D
        String numberPart =
                seatNumber
                        .trim()
                        .replaceAll("[^0-9]", "");

        if (numberPart.isEmpty()) {

            throw new RuntimeException(
                    "Invalid seat number: "
                    + seatNumber
            );
        }

        int row =
                Integer.parseInt(numberPart);

        // 1 - 6
        if (row <= 6) {
            return "ECONOMY";
        }

        // 7 - 9
        if (row <= 9) {
            return "PREMIUM_ECONOMY";
        }

        // 10 - 11
        if (row <= 11) {
            return "BUSINESS";
        }

        // 12 - 13
        if (row <= 13) {
            return "FIRST_CLASS";
        }

        throw new RuntimeException(
                "Invalid seat row: "
                + row
        );
    }
}