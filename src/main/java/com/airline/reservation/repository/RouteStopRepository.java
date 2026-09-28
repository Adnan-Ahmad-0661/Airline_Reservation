
package com.airline.reservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation.entity.RouteStop;

public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {

    List<RouteStop> findByRouteIdOrderByStopOrder(Long routeId);
}