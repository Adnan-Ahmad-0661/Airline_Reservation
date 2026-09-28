package com.airline.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation.entity.Airport;

public interface AirportRepository
        extends JpaRepository<Airport, Long> {

    Airport findByCityIgnoreCase(String city);

    Airport findByAirportCodeIgnoreCase(String airportCode);
}