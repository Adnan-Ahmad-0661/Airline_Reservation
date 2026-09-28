package com.airline.reservation.service;

import java.util.List;

import com.airline.reservation.entity.Airport;

public interface AirportService {

    Airport addAirport(Airport airport);

    List<Airport> getAllAirports();

    Airport getAirportById(Long id);

    Airport updateAirport(Long id, Airport airport);

    void deleteAirport(Long id);
}