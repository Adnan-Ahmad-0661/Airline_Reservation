package com.airline.reservation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airline.reservation.entity.Passenger;
import com.airline.reservation.repository.PassengerRepository;
import com.airline.reservation.service.PassengerService;


@Service
public class PassengerServiceImpl implements PassengerService{

	@Autowired
	private PassengerRepository passengerRepository;
	@Override
	public Passenger addPassenger(Passenger passenger) {
		return passengerRepository.save(passenger);
	}

	@Override
	public Passenger getPassengerById(Long id) {

		return	passengerRepository.findById(id).orElse(null);
	}

	@Override
	public List<Passenger> getAllPassengers() {
		
		return passengerRepository.findAll();
	}

	@Override
	public Passenger updatePassenger(Long id, Passenger passenger) {
		 
		Passenger passenger2 = passengerRepository.findById(id).orElse(null);
		if(passenger2==null)
		{
			return null;
		}
		
		passenger2.setName(passenger.getName());
		passenger2.setAge(passenger.getAge());
		passenger2.setGender(passenger.getGender());
		passenger2.setPassportNumber(passenger.getPassportNumber());
		passenger2.setId(passenger.getId());
		return passengerRepository.save(passenger2);
	}

	@Override
	public void deletePassenger(Long id) {
	passengerRepository.deleteById(id);
		
	}

}
