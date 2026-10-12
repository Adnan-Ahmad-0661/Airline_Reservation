package com.airline.reservation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AIRPORT")
public class Airport {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String airportName;
	@NotBlank(message = "City is required")
	@NotEmpty(message = "city is Empty")
	private String city;
	@Column(unique = true, nullable = false)
	@NotBlank(message = "Airport code is required")
	@NotEmpty(message = "Airport code is Empty")
	private String airportCode;


}
