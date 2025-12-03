package com.RECADEP.backend.Controllers;

import com.RECADEP.backend.Services.Auth0Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "http://localhost:4200")
@CrossOrigin(origins = "${FRONTEND_CORS_DOMAIN}")
public class RoleController {

  private final Auth0Service auth0Service;

  public RoleController(Auth0Service auth0Service) {
    this.auth0Service = auth0Service;
  }

  @PostMapping("/assign-role")
  public ResponseEntity<?> assignRole(@RequestBody Map<String, String> body) {
    String userId = body.get("user_id");
    if (userId == null || userId.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "user_id es requerido"));
    }
    auth0Service.asignarRolPorDefecto(userId);
    return ResponseEntity.ok(Map.of("status", "rol_asignado", "user_id", userId));
  }
}
