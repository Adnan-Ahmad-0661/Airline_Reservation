package com.airline.reservation.dto;

import lombok.Data;

@Data
public class RegisterRequestDto {
	
	private String email;

	private String name;

//	@JsonIgnore
	private String password;

	private String phone;

	

}
