package com.airline.reservation.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.Payment;
import com.airline.reservation.entity.Ticket;
import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.PaymentRepository;
import com.airline.reservation.repository.TicketRepository;
import com.airline.reservation.service.TicketService;

@Service
public class TicketServiceImpl implements TicketService {

	@Autowired
	private TicketRepository ticketRepository;

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Override
	public Ticket generateTicket(Long bookingId) {

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new RuntimeException("Booking not found"));

		// Check payment
		Payment payment = paymentRepository.findFirstByBookings_Id(bookingId);

		if (payment == null) {
			throw new RuntimeException("Payment not completed");
		}
		if (!"SUCCESS".equalsIgnoreCase(payment.getPaymentStatus())) {

			throw new RuntimeException("Payment is not successful");
		}
		// Check existing ticket
		Ticket existingTicket = ticketRepository.findByBookingId(bookingId);
		if (existingTicket != null) {
			throw new RuntimeException("Ticket already generated");
		}

		Ticket ticket = new Ticket();

		ticket.setBooking(booking);

		Random random = new Random();

		ticket.setPnr("PNR-" + (100000 + random.nextInt(900000)));

		ticket.setTicketStatus("CONFIRMED");

		ticket.setBookingDate(LocalDateTime.now());

		return ticketRepository.save(ticket);

	}
	@Override
	public Ticket getTicketById(Long id) {
		// TODO Auto-generated method stub
		// return ticketRepository.findById(id).orElse(null);
		return ticketRepository.findById(id).orElse(null);
	}
	@Override
	public Ticket getTicketByPnr(String pnr) {
		// TODO Auto-generated method stub
		return ticketRepository.findByPnr(pnr);
	}
	@Override
	public Ticket getTicketByBookingId(Long bookingId) {
		// TODO Auto-generated method stub
		return ticketRepository.findByBookingId(bookingId);
	}

	@Override
	public List<Ticket> getAllTickets() {
		// TODO Auto-generated method stub
		return ticketRepository.findAll();
	}

}
