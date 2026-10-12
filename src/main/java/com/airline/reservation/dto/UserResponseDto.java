package com.airline.reservation.dto;

import lombok.Data;

@Data
public class UserResponseDto {

	   private Long id;
    private String email;
    private String name;
    private String phone;
    private String role;
    private String profilePhoto;
    
}
