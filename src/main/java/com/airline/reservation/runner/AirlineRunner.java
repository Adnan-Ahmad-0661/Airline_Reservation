package com.airline.reservation.runner;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.airline.reservation.entity.User;
import com.airline.reservation.repository.UserRepository;

import lombok.AllArgsConstructor;
@Component
@AllArgsConstructor
public class AirlineRunner implements CommandLineRunner {

		private UserRepository userRepository;
		private PasswordEncoder passwordEncoder;
	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		if(!userRepository.existsByEmail("adnanahamd8533@gmail.com"))
		{
			User user = new User();
			user.setEmail("adnanahamd8533@gmail.com");
			user.setLastActive(LocalDateTime.now());
			user.setName("Adnan");
			String password = passwordEncoder.encode("adnan5050");
			user.setPassword(password);
			user.setPhone("8874670661");
			user.setRole("ADMIN");
			userRepository.save(user);
		}
		
	}

}
