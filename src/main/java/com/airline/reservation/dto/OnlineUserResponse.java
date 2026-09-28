package com.airline.reservation.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnlineUserResponse {

	
    private Long id;
	private String name;
	private String email;
	private String phone;
	private String role;
	  private String status;
	  private LocalDateTime lastActive;
	
}
