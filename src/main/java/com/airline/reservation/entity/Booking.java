package com.airline.reservation.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BOOKING")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String pnr;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	private Double amount;
	private LocalDateTime bookingDate;
	private String seatNumber;

	private String status;

	@ManyToOne
	@JoinColumn(name = "flight_id")
	private Flight flight;

	@ManyToOne
	@JoinColumn(name = "passenger_id")
	private Passenger passenger;

}
