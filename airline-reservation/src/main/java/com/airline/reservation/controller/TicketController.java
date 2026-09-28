package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airline.reservation.entity.Ticket;
import com.airline.reservation.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin
public class TicketController {

	@Autowired
	private TicketService ticketService;

	// GENERATE TICKET
	@PostMapping
	public Ticket generateTicket(@RequestParam Long bookingId) {

		return ticketService.generateTicket(bookingId);
	}

	// GET ALL TICKETS
	@GetMapping
	public List<Ticket> getAllTickets() {

		return ticketService.getAllTickets();
	}

	// GET TICKET BY ID
	@GetMapping("/{id}")
	public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {

		Ticket ticket = ticketService.getTicketById(id);

		if (ticket == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(ticket);
	}

	// SEARCH BY PNR
	@GetMapping("/pnr/{pnr}")
	public ResponseEntity<Ticket> getTicketByPnr(@PathVariable String pnr) {

		Ticket ticket = ticketService.getTicketByPnr(pnr);

		if (ticket == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(ticket);
	}

	// GET BY BOOKING
	@GetMapping("/booking/{bookingId}")
	public ResponseEntity<Ticket> getTicketByBookingId(@PathVariable Long bookingId) {

		Ticket ticket = ticketService.getTicketByBookingId(bookingId);

		if (ticket == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(ticket);
	}
}