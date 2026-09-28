package com.airline.reservation.service;

import java.util.List;

import com.airline.reservation.entity.Passenger;


public interface PassengerService {

    Passenger addPassenger(Passenger passenger);

    Passenger getPassengerById(Long id);

    List<Passenger> getAllPassengers();

    Passenger updatePassenger(Long id, Passenger passenger);

    void deletePassenger(Long id);
}