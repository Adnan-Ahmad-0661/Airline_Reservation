package com.airline.reservation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation.entity.Airport;
import com.airline.reservation.entity.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {

	 Optional<Route> findBySourceAirportAndDestinationAirport(
	            Airport sourceAirport,
	            Airport destinationAirport);
}