package com.airline.reservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airline.reservation.entity.Airport;
import com.airline.reservation.entity.Flight;

@Repository
public interface FlightRepository  extends JpaRepository<Flight, Long>{
	List<Flight> findBySourceAirportAndDestinationAirport(
	        Airport sourceAirport,
	        Airport destinationAirport
	);
	
	
	  List<Flight> findBySourceAirportAirportCodeAndDestinationAirportAirportCode(
	            String sourceCode,
	            String destinationCode);
	  
	Flight findByFlightNumber(String flightNumber);
}

  