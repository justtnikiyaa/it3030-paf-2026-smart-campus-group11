package com.smartcampus.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Objects;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String fullName = oauthUser.getAttribute("name");
        String pictureUrl = oauthUser.getAttribute("picture");

        String role = authentication.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .anyMatch("ROLE_ADMIN"::equals) ? "ADMIN" : "USER";

        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendUrl + "/oauth-success")
                .queryParam("email", Objects.toString(email, ""))
                .queryParam("fullName", Objects.toString(fullName, "User"))
                .queryParam("pictureUrl", Objects.toString(pictureUrl, ""))
                .queryParam("role", role)
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
