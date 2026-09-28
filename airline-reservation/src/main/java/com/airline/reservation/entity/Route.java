package com.airline.reservation.entity;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "route")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String routeName;

    @ManyToOne
    @JoinColumn(name = "source_airport_id")
    private Airport sourceAirport;

    @ManyToOne
    @JoinColumn(name = "destination_airport_id")
    private Airport destinationAirport;

   
}