package com.airline.reservation.entity;


import org.springframework.data.annotation.Version;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;

    private String airlineName;
    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;
    private Double economyPrice;
    private Double premiumEconomyPrice;
    private Double businessPrice;
    private Double firstClassPrice;

    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "source_airport_id")
    private Airport sourceAirport;

    @ManyToOne
    @JoinColumn(name = "destination_airport_id")
    private Airport destinationAirport;

    private Integer availableSeats;

    private Integer totalSeats = 52;
    
    
//    @Transient
    @Version
    private Long versionId;
}