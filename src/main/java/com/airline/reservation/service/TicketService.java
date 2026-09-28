package com.airline.reservation.service;

import java.util.List;

import com.airline.reservation.entity.Ticket;

public interface TicketService {
	  Ticket generateTicket(Long bookingId);

	    Ticket getTicketById(Long id);

	    Ticket getTicketByPnr(String pnr);

	    Ticket getTicketByBookingId(Long bookingId);

	    List<Ticket> getAllTickets();
}
