package com.RECADEP.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RECADEP.backend.Entitys.Field;
import com.RECADEP.backend.Entitys.Reservation;
import com.RECADEP.backend.Repositories.FieldRepository;
import com.RECADEP.backend.Repositories.ReservationRepository;
import org.springframework.web.bind.annotation.RequestParam;
import com.RECADEP.backend.Controllers.CustomerController;

@RestController
@RequestMapping("/api/reservation")
//@CrossOrigin(origins = "http://localhost:4200")
@CrossOrigin(origins = "${FRONTEND_CORS_DOMAIN}")
public class ReservationController {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private FieldRepository fieldRepository;
    

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/{id}")
    public Reservation getReservation(@PathVariable Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

    @GetMapping("/collision")
    public boolean existsCollision(@RequestParam Long field_id, @RequestParam String reservationDate,
            @RequestParam String startTime, @RequestParam String endTime) {

        Field field = fieldRepository.findById(field_id).orElse(null);
        if (field == null)
            return false;

        return reservationRepository.existsCollision(field, reservationDate, startTime, endTime);
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        System.out.println("Recibido: " + reservation.getCustomer());
        return reservationRepository.save(reservation);
    }

    @PutMapping("/{id}")
    public Reservation updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {

        reservation.setReservationId(id);
        return reservationRepository.save(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
    }

    @GetMapping("/by-customer/{id}")
    public List<Reservation> getReservationsByCustomer(@PathVariable Long id) {
        return reservationRepository.findByCustomerId(id);
    }

}
