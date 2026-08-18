package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation.entity.Passenger;
import com.airline.reservation.service.PassengerService;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin
public class PassengerController {

	@Autowired
	private PassengerService passengerService;

	@PostMapping
	public Passenger addPassenger(@RequestBody Passenger passenger) {
		return passengerService.addPassenger(passenger);

	}

	@GetMapping
	public List<Passenger> getAllPassenger() {
		return passengerService.getAllPassengers();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Passenger> getPassengerById(@PathVariable Long id) {

		Passenger passenger = passengerService.getPassengerById(id);

		if (passenger == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(passenger);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Passenger> updatePassenger(@PathVariable Long id, @RequestBody Passenger passenger) {

		Passenger updated = passengerService.updatePassenger(id, passenger);

		if (updated == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePassenger(@PathVariable Long id) {

		passengerService.deletePassenger(id);
		return ResponseEntity.ok("Passenger deleted successfully");

	}
}
