package com.airline.reservation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airline.reservation.entity.Airport;
import com.airline.reservation.repository.AirportRepository;
import com.airline.reservation.service.AirportService;

@Service
public class AirportServiceImpl implements AirportService {

	@Autowired
	private AirportRepository airportRepository;

	@Override
	public Airport addAirport(Airport airport) {

		if (airport.getAirportCode() == null || airport.getAirportCode().trim().isEmpty()) {

			throw new RuntimeException("Airport code is required");
		}

		if (airport.getCity() == null || airport.getCity().trim().isEmpty()) {

			throw new RuntimeException("City is required");
		}

		airport.setAirportCode(airport.getAirportCode().trim().toUpperCase());

		airport.setCity(airport.getCity().trim());

		if (airport.getAirportName() != null) {
			airport.setAirportName(airport.getAirportName().trim());
		}

		return airportRepository.save(airport);
	}

	@Override
	public List<Airport> getAllAirports() {
		return airportRepository.findAll();
	}

	@Override
	public Airport getAirportById(Long id) {

		return airportRepository.findById(id).orElse(null);
	}

	@Override
	public Airport updateAirport(Long id, Airport airport) {

		Airport existingAirport = airportRepository.findById(id).orElse(null);

		if (existingAirport == null) {
			return null;
		}

		if (airport.getAirportName() != null) {
			existingAirport.setAirportName(airport.getAirportName().trim());
		}

		if (airport.getCity() != null) {
			existingAirport.setCity(airport.getCity().trim());
		}

		if (airport.getAirportCode() != null) {
			existingAirport.setAirportCode(airport.getAirportCode().trim().toUpperCase());
		}

		return airportRepository.save(existingAirport);
	}

	@Override
	public void deleteAirport(Long id) {

		if (!airportRepository.existsById(id)) {
			throw new RuntimeException("Airport not found with ID: " + id);
		}

		airportRepository.deleteById(id);
	}
}