package com.airline.reservation.entity;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long id;

	    @OneToOne
	    @JoinColumn(name = "booking_id")
	    private Booking booking;

	    private double amount;

	    private String paymentMethod;

	    private String transactionId;

	    private LocalDateTime paymentDate;

	    
	    private String paymentStatus;
	    
	  

	  

	  

}
