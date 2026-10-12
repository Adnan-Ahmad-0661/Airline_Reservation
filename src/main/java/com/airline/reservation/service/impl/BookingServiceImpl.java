package com.airline.reservation.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.airline.reservation.dto.BookingResponse;
import com.airline.reservation.dto.UserResponseDto;
import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.Flight;
import com.airline.reservation.entity.Passenger;
import com.airline.reservation.entity.Seat;
import com.airline.reservation.entity.User;
import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.FlightRepository;
import com.airline.reservation.repository.PassengerRepository;
import com.airline.reservation.repository.SeatRepository;
import com.airline.reservation.repository.UserRepository;
import com.airline.reservation.service.BookingService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class BookingServiceImpl implements BookingService {

    private BookingRepository bookingRepository;

    
    private SeatRepository seatRepository;

    private UserRepository userRepository;

    private FlightRepository flightRepository;

    private PassengerRepository passengerRepository;

    

    // =====================================================
    // CREATE BOOKING
    // =====================================================

    @Override
    @Transactional
    public Booking createBooking(
            Long userId,
            Long flightId,
            Long passengerId,
            String seatNumber) {

        System.out.println(
                "========== CREATE BOOKING =========="
        );

        // =================================================
        // 1. AUTHENTICATION CHECK
        // =================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Please login first to book a ticket."
            );
        }

        // =================================================
        // 2. GET LOGGED-IN EMAIL
        // =================================================

        String loggedInEmail =
                authentication.getName();

        System.out.println(
                "Logged-in Email: "
                        + loggedInEmail
        );

        // =================================================
        // 3. USER CHECK
        // =================================================

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with ID: "
                                                + userId
                                )
                        );

        // =================================================
        // 4. USER VALIDATION
        // =================================================

        if (!user.getEmail()
                .equalsIgnoreCase(loggedInEmail)) {

            throw new RuntimeException(
                    "You are not allowed to book using another user's account."
            );
        }

        // =================================================
        // 5. FLIGHT CHECK
        // =================================================

        Flight flight =
                flightRepository.findById(flightId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Flight not found with ID: "
                                                + flightId
                                )
                        );

        // =================================================
        // 6. CHECK FLIGHT STATUS
        // =================================================

        if ("CANCELLED".equalsIgnoreCase(
                flight.getStatus())) {

            throw new RuntimeException(
                    "This flight is cancelled."
            );
        }

        // =================================================
        // 7. PASSENGER CHECK
        // =================================================

        Passenger passenger =
                passengerRepository.findById(passengerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Passenger not found with ID: "
                                                + passengerId
                                )
                        );

        // =================================================
        // 8. SEAT NUMBER CHECK
        // =================================================

        if (seatNumber == null ||
                seatNumber.trim().isEmpty()) {

            throw new RuntimeException(
                    "Seat number is required"
            );
        }

        seatNumber = seatNumber.trim();

        // =================================================
        // 9. AVAILABLE SEATS CHECK
        // =================================================

        if (flight.getAvailableSeats() == null ||
                flight.getAvailableSeats() <= 0) {

            throw new RuntimeException(
                    "No seats available on this flight"
            );
        }

        // =================================================
        // 10. FIND SEAT
        // =================================================

        Seat seat =
                seatRepository
                        .findByFlightAndSeatNumber(
                                flight,
                                seatNumber
                        );

        if (seat == null) {

            throw new RuntimeException(
                    "Seat "
                            + seatNumber
                            + " not found for Flight ID "
                            + flightId
            );
        }

        // =================================================
        // 11. CHECK SEAT STATUS
        // =================================================

        if ("BOOKED".equalsIgnoreCase(
                seat.getStatus())) {

            throw new RuntimeException(
                    "Seat "
                            + seatNumber
                            + " is already booked"
            );
        }

        // =================================================
        // 12. BOOK SEAT
        // =================================================

        seat.setStatus("BOOKED");

        seatRepository.saveAndFlush(seat);

        // =================================================
        // 13. DECREASE AVAILABLE SEATS
        // =================================================

        flight.setAvailableSeats(
                flight.getAvailableSeats() - 1
        );

        flightRepository.saveAndFlush(flight);

        // =================================================
        // 14. CREATE BOOKING
        // =================================================

        Booking booking = new Booking();

        booking.setUser(user);

        booking.setFlight(flight);

        booking.setPassenger(passenger);

        booking.setSeatNumber(seatNumber);

        booking.setBookingDate(
                LocalDateTime.now()
        );

        // =================================================
        // 15. SEAT NUMBER WISE PRICE
        // =================================================

        int seatNo;

        try {

            seatNo = Integer.parseInt(
                    seatNumber.replaceAll(
                            "[^0-9]",
                            ""
                    )
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid seat number: "
                            + seatNumber
            );
        }

        // =================================================
        // ECONOMY
        // Seats 1 - 32
        // =================================================

        if (seatNo >= 1 && seatNo <= 32) {

            if (flight.getEconomyPrice() == null) {

                throw new RuntimeException(
                        "Economy price is not set for this flight."
                );
            }

            booking.setAmount(
                    flight.getEconomyPrice()
            );

        }

        // =================================================
        // PREMIUM ECONOMY
        // Seats 33 - 44
        // =================================================

        else if (seatNo >= 33 && seatNo <= 44) {

            if (flight.getPremiumEconomyPrice() == null) {

                throw new RuntimeException(
                        "Premium Economy price is not set for this flight."
                );
            }

            booking.setAmount(
                    flight.getPremiumEconomyPrice()
            );

        }

        // =================================================
        // BUSINESS
        // Seats 45 - 50
        // =================================================

        else if (seatNo >= 45 && seatNo <= 50) {

            if (flight.getBusinessPrice() == null) {

                throw new RuntimeException(
                        "Business price is not set for this flight."
                );
            }

            booking.setAmount(
                    flight.getBusinessPrice()
            );

        }

        // =================================================
        // FIRST CLASS
        // Seats 51 - 52
        // =================================================

        else if (seatNo >= 51 && seatNo <= 52) {

            if (flight.getFirstClassPrice() == null) {

                throw new RuntimeException(
                        "First Class price is not set for this flight."
                );
            }

            booking.setAmount(
                    flight.getFirstClassPrice()
            );

        }

        else {

            throw new RuntimeException(
                    "Invalid seat number: "
                            + seatNumber
            );
        }

        // =================================================
        // 16. BOOKING STATUS
        // =================================================

        booking.setStatus(
                "CONFIRMED"
        );

        // =================================================
        // 17. GENERATE PNR
        // =================================================

        booking.setPnr(
                "PNR"
                        + System.currentTimeMillis()
        );

        // =================================================
        // 18. SAVE BOOKING
        // =================================================

        Booking savedBooking =
                bookingRepository
                        .saveAndFlush(booking);

        // =================================================
        // 19. LOG
        // =================================================

        System.out.println(
                "BOOKING CREATED ID: "
                        + savedBooking.getId()
        );

        System.out.println(
                "PNR: "
                        + savedBooking.getPnr()
        );

        System.out.println(
                "SEAT: "
                        + savedBooking.getSeatNumber()
        );

        System.out.println(
                "AMOUNT: "
                        + savedBooking.getAmount()
        );

        System.out.println(
                "==================================="
        );

        return savedBooking;
    }

    // =====================================================
    // GET ALL BOOKINGS
    // =====================================================

    @Override
    public List<BookingResponse> getAllBookings() {

        List<Booking> bookings =
                bookingRepository.findAll();


        return bookings.stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET BOOKING BY PNR
    // =====================================================

    @Override
    public BookingResponse getBookingByPnr(
            String pnr) {

        Booking booking =
                bookingRepository.findByPnr(
                        pnr
                );


        if (booking == null) {

            return null;
        }


        return convertToBookingResponse(
                booking
        );
    }


    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    @Override
    @Transactional
    public Booking cancelBooking(
            Long bookingId) {


        Booking booking =
                bookingRepository.findById(
                        bookingId
                )
                .orElseThrow(() ->
                    new RuntimeException(
                        "Booking not found with ID: "
                        + bookingId
                    )
                );


        Authentication authentication =
                SecurityContextHolder
                    .getContext()
                    .getAuthentication();


        if (authentication == null ||
            !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Please login first."
            );
        }


        String email =
                authentication.getName();


        boolean isAdmin =
                authentication
                    .getAuthorities()
                    .stream()
                    .anyMatch(authority ->
                        authority
                            .getAuthority()
                            .equals("ROLE_ADMIN")
                    );


        if (!isAdmin &&
            !booking.getUser()
                    .getEmail()
                    .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You are not allowed to cancel this booking"
            );
        }


        if ("CANCELLED".equalsIgnoreCase(
                booking.getStatus())) {

            throw new RuntimeException(
                    "Booking already cancelled"
            );
        }


        Flight flight =
                booking.getFlight();


        if (flight == null) {

            throw new RuntimeException(
                    "Flight not found for booking"
            );
        }


        String seatNumber =
                booking.getSeatNumber();


        Seat seat =
                seatRepository
                    .findByFlightAndSeatNumber(
                        flight,
                        seatNumber
                    );


        if (seat == null) {

            throw new RuntimeException(
                    "Seat "
                    + seatNumber
                    + " not found for Flight ID "
                    + flight.getId()
            );
        }


        // CANCEL BOOKING

        booking.setStatus(
                "CANCELLED"
        );

        bookingRepository.save(
                booking
        );


        // RELEASE SEAT

        seat.setStatus(
                "AVAILABLE"
        );

        seatRepository.save(
                seat
        );


        // INCREASE AVAILABLE SEATS

        if (flight.getAvailableSeats() != null) {

            flight.setAvailableSeats(
                    flight.getAvailableSeats() + 1
            );

            flightRepository.save(
                    flight
            );
        }


        return booking;
    }


    // =====================================================
    // GET BOOKING BY ID
    // =====================================================

    @Override
    public BookingResponse getBookingById(
            Long id) {


        Booking booking =
                bookingRepository.findById(
                        id
                )
                .orElseThrow(() ->
                    new RuntimeException(
                        "Booking not found with ID: "
                        + id
                    )
                );


        return convertToBookingResponse(
                booking
        );
    }


    // =====================================================
    // GET BOOKINGS BY USER
    // =====================================================

    @Override
    public List<BookingResponse> getBookingsByUserId(
            Long userId) {


        List<Booking> bookings =
                bookingRepository.findByUserId(
                        userId
                );


        return bookings.stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // CONVERT BOOKING -> RESPONSE
    // =====================================================

    private BookingResponse convertToBookingResponse(
            Booking booking) {


        BookingResponse response =
                new BookingResponse();


        response.setId(
                booking.getId()
        );

        response.setPnr(
                booking.getPnr()
        );

        response.setAmount(
                booking.getAmount()
        );

        response.setBookingDate(
                booking.getBookingDate()
        );

        response.setSeatNumber(
                booking.getSeatNumber()
        );

        response.setStatus(
                booking.getStatus()
        );


        // USER

        User user =
                booking.getUser();


        if (user != null) {

            UserResponseDto userResponse =
                    new UserResponseDto();


            userResponse.setId(
                    user.getId()
            );

            userResponse.setEmail(
                    user.getEmail()
            );

            userResponse.setName(
                    user.getName()
            );

            userResponse.setPhone(
                    user.getPhone()
            );

            userResponse.setRole(
                    user.getRole()
            );


            response.setUser(
                    userResponse
            );
        }


        // FLIGHT

        response.setFlight(
                booking.getFlight()
        );


        // PASSENGER

        response.setPassenger(
                booking.getPassenger()
        );


        return response;
    }
}