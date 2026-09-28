package com.airline.reservation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airline.reservation.entity.Airport;
import com.airline.reservation.service.AirportService;

@RestController
@RequestMapping("/api/airports")

public class AirportController {

	@Autowired
	private AirportService airportService;

	// ADD AIRPORT
	@PostMapping
	public Airport addAirport(@RequestBody Airport airport) {

		return airportService.addAirport(airport);
	}

	// GET ALL AIRPORTS
	@GetMapping
	public List<Airport> getAllAirports() {

		return airportService.getAllAirports();
	}

	// GET AIRPORT BY ID
	@GetMapping("/{id}")
	public ResponseEntity<Airport> getAirportById(@PathVariable Long id) {

		Airport airport = airportService.getAirportById(id);

		if (airport == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(airport);
	}

	// UPDATE AIRPORT
	@PutMapping("/{id}")
	public ResponseEntity<Airport> updateAirport(@PathVariable Long id, @RequestBody Airport airport) {

		Airport updatedAirport = airportService.updateAirport(id, airport);

		if (updatedAirport == null) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(updatedAirport);
	}

	// DELETE AIRPORT
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAirport(@PathVariable Long id) {

		airportService.deleteAirport(id);

		return ResponseEntity.ok("Airport deleted successfully");
	}
}