package com.RECADEP.backend.Services;

import com.auth0.client.auth.AuthAPI;
import com.auth0.json.auth.TokenHolder;
import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.exception.Auth0Exception;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Auth0Service {

  @Value("${auth0.domain}")
  private String domain;

  @Value("${auth0.m2m.clientId}")
  private String clientId;

  @Value("${auth0.m2m.clientSecret}")
  private String clientSecret;

  @Value("${auth0.roleId}")
  private String roleId;

  private String getManagementApiToken() {
    AuthAPI auth = new AuthAPI(domain, clientId, clientSecret);
    TokenHolder holder;
    try {
        holder = auth.requestToken("https://" + domain + "/api/v2/").execute();
        return holder.getAccessToken();
    } catch (Auth0Exception e) {
        // TODO Auto-generated catch block
        throw new RuntimeException("Error obteniendo token de Management API: " + e.getMessage(), e);
    }    
  }

  public void asignarRolPorDefecto(String userId) {
    String token = getManagementApiToken();
    ManagementAPI mgmt = new ManagementAPI(domain, token);
    try {
      mgmt.users().addRoles(userId, List.of(roleId)).execute();
    } catch (Auth0Exception e) {
      throw new RuntimeException("Error al asignar rol a " + userId + ": " + e.getMessage(), e);
    }
  }
}