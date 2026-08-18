package com.airline.reservation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airline.reservation.entity.Airport;
import com.airline.reservation.entity.Route;
import com.airline.reservation.entity.RouteStop;
import com.airline.reservation.repository.AirportRepository;
import com.airline.reservation.repository.RouteRepository;
import com.airline.reservation.repository.RouteStopRepository;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteController {

    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final AirportRepository airportRepository;

    public RouteController(
            RouteRepository routeRepository,
            RouteStopRepository routeStopRepository,
            AirportRepository airportRepository) {

        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
        this.airportRepository = airportRepository;
    }

    // ADD ROUTE
    @PostMapping
    public ResponseEntity<Route> addRoute(@RequestBody RouteRequest request) {

        Airport sourceAirport =
                airportRepository.findById(request.getSourceAirportId())
                        .orElseThrow(() -> new RuntimeException("Source airport not found"));

        Airport destinationAirport =
                airportRepository.findById(request.getDestinationAirportId())
                        .orElseThrow(() -> new RuntimeException("Destination airport not found"));

        Route route = new Route();

        route.setRouteName(request.getRouteName());
        route.setSourceAirport(sourceAirport);
        route.setDestinationAirport(destinationAirport);

        Route savedRoute = routeRepository.save(route);

        // SAVE STOPS
        if (request.getStops() != null) {

            for (RouteStopRequest stopRequest : request.getStops()) {

                RouteStop stop = new RouteStop();

                stop.setRoute(savedRoute);
                stop.setCity(stopRequest.getCity());
                stop.setStopOrder(stopRequest.getStopOrder());

                routeStopRepository.save(stop);
            }
        }

        return ResponseEntity.ok(savedRoute);
    }

    // GET ALL ROUTES
    @GetMapping
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    // GET STOPS OF A ROUTE
    @GetMapping("/{routeId}/stops")
    public List<RouteStop> getRouteStops(@PathVariable Long routeId) {

        return routeStopRepository
                .findByRouteIdOrderByStopOrder(routeId);
    }

    // REQUEST CLASS
    public static class RouteRequest {

        private String routeName;

        private Long sourceAirportId;

        private Long destinationAirportId;

        private List<RouteStopRequest> stops;

        public String getRouteName() {
            return routeName;
        }

        public void setRouteName(String routeName) {
            this.routeName = routeName;
        }

        public Long getSourceAirportId() {
            return sourceAirportId;
        }

        public void setSourceAirportId(Long sourceAirportId) {
            this.sourceAirportId = sourceAirportId;
        }

        public Long getDestinationAirportId() {
            return destinationAirportId;
        }

        public void setDestinationAirportId(Long destinationAirportId) {
            this.destinationAirportId = destinationAirportId;
        }

        public List<RouteStopRequest> getStops() {
            return stops;
        }

        public void setStops(List<RouteStopRequest> stops) {
            this.stops = stops;
        }
    }

    public static class RouteStopRequest {

        private String city;

        private Integer stopOrder;

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public Integer getStopOrder() {
            return stopOrder;
        }

        public void setStopOrder(Integer stopOrder) {
            this.stopOrder = stopOrder;
        }
    }
}