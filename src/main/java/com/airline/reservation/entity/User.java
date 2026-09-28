package com.airline.reservation.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String email;

	private String name;

//	@JsonIgnore
	private String password;

	private String phone;

	private String role;

	private boolean online;

	private LocalDateTime loginTime;

	private LocalDateTime lastActive;

	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] profilePhoto;
}