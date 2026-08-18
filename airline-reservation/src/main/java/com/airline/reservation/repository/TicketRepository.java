package com.airline.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation.entity.Ticket;

public interface TicketRepository  extends JpaRepository<Ticket, Long>{
	  Ticket findByPnr(String pnr);

	    Ticket findByBookingId(Long bookingId);
}
