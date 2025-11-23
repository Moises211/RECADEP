package com.RECADEP.backend.Controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
//import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.RECADEP.backend.Entitys.Customer;
import com.RECADEP.backend.Entitys.User;
import com.RECADEP.backend.Entitys.Users;
import com.RECADEP.backend.Repositories.CustomerRepository;
import com.RECADEP.backend.Repositories.UsersRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UsersController {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    @GetMapping("/{id}")
    public Users getUsers(@PathVariable Long id) {
        return usersRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Users createUsers(@RequestBody Users users) {
        return usersRepository.save(users);
    }

    @PutMapping("/{id}")
    public Users updateUsers(@PathVariable Long id, @RequestBody Users users) {

        users.setUsersId(id);
        return usersRepository.save(users);
    }

    @DeleteMapping("/{id}")
    public void deleteUsers(@PathVariable Long id) {
        usersRepository.deleteById(id);
    }

    @GetMapping("/by-email")
    public Users findByEmail(@RequestParam String email) {
        Users user = usersRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        return user;
    }
    @PostMapping("/sync")
    public ResponseEntity<?> sync(@RequestBody Users payload) {
        Users existente = usersRepository.findByEmail(payload.getEmail());

        if (existente == null) {
            // Crear nuevo usuario
            //Users nuevo = payload;
            System.out.println("Payload Birthdate: " + payload.getBirthdate());
            /*nuevo.setEmail(payload.getEmail());
            nuevo.setUsername(payload.getUsername());
            nuevo.setLastname(payload.getLastname());
            nuevo.setBirthdate(payload.getBirthdate());            
            nuevo.setDocumentNumber(payload.getDocumentNumber());
            nuevo.setTelephone(payload.getTelephone());*/
            
            Users savedUser = usersRepository.save(payload);

            // Crear Customer asociado
            Customer customer = new Customer();
            customer.setRegistrationDate(LocalDate.now().toString());
            customer.setUsers(savedUser);
            
            customerRepository.save(customer);

            return ResponseEntity.ok(savedUser);
        } else {
            // Actualizar datos si ya existe
            if (existente.getUsername() == null)
            existente.setUsername(payload.getUsername());
            if (existente.getLastname() == null)
            existente.setLastname(payload.getLastname());
            if (existente.getBirthdate() == null)
            existente.setBirthdate(payload.getBirthdate());
            if (existente.getDocumentNumber() == null)
            existente.setDocumentNumber(payload.getDocumentNumber());
            if (existente.getTelephone() == null)
            existente.setTelephone(payload.getTelephone());
            Users updatedUser = new Users();
            if (existente != null)
            updatedUser = usersRepository.save(existente);

            return ResponseEntity.ok(updatedUser);
        }
    }
    
    /*
     * //Seccion para buscar usuario por email y validar si existe en la base de
     * datos local por creacion de cuenta con Auth0
     * 
     * @PostMapping("/sync")
     * public ResponseEntity<?> sync(@AuthenticationPrincipal Jwt principal) {
     * String correo = principal.getClaim("email");
     * 
     * Users existente = usersRepository.findByEmail(correo);
     * if (existente == null) {
     * Users nuevo = new Users();
     * nuevo.setEmail(correo);
     * nuevo.setPerfilCompleto(false);//Crear usuario con perfil incompleto en la
     * base de datos local
     * createUsers(nuevo);
     * }
     * 
     * return ResponseEntity.ok().build();
     * }
     */

}
