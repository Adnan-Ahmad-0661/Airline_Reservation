package com.airline.reservation.service;

import java.util.List;

import com.airline.reservation.dto.BookingResponse;
import com.airline.reservation.entity.Booking;

public interface BookingService {

    Booking createBooking(
            Long userId,
            Long flightId,
            Long passengerId,
            String seatNumber
    );

    BookingResponse getBookingById(Long id);

    List<BookingResponse> getAllBookings();

    BookingResponse getBookingByPnr(String pnr);

    Booking cancelBooking(Long bookingId);

    List<BookingResponse> getBookingsByUserId(Long userId);
}