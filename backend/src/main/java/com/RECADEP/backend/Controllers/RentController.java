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

import com.RECADEP.backend.Entitys.Rent;
import com.RECADEP.backend.Repositories.RentRepository;

@RestController
@RequestMapping("/api/rent")
//@CrossOrigin(origins = "http://localhost:4200")
@CrossOrigin(origins = "${FRONTEND_CORS_DOMAIN}")
public class RentController {

    @Autowired
    private RentRepository rentRepository;

    @GetMapping
    public List<Rent> getAllRents() {
        return rentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Rent getRent(@PathVariable Long id) {
        return rentRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Rent createRent(@RequestBody Rent rent) {
        return rentRepository.save(rent);
    }

    @PutMapping("/{id}")
    public Rent updateRent(@PathVariable Long id, @RequestBody Rent rent) {
        rent.setRentId(id);
        return rentRepository.save(rent);
    }

    @DeleteMapping("/{id}")
    public void deleteRent(@PathVariable Long id) {
        rentRepository.deleteById(id);
    }
}
