package com.airline.reservation.service;

import java.util.List;

import com.airline.reservation.entity.Seat;

public interface SeatService {

	 Seat addSeat(Long flightId, Seat seat);

	    List<Seat> getSeatsByFlight(Long flightId);

	    Seat getSeatById(Long id);

	    Seat updateSeat(Long id, Seat seat);

	    void deleteSeat(Long id);
	    
}
