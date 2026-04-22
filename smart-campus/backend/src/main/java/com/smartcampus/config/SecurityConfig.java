package com.smartcampus.config;

import com.smartcampus.security.CustomOAuth2UserService;
import com.smartcampus.security.CustomOidcUserService;
import com.smartcampus.security.OAuth2LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/",
            "/error",
            "/login/**",
            "/oauth2/**"
    };

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOidcUserService customOidcUserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                        // Admin-only APIs
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Module D APIs: notifications for USER/ADMIN
                        .requestMatchers("/api/notifications/**").hasAnyRole("USER", "ADMIN")

                        // Auth APIs: authenticated users
                        .requestMatchers("/api/auth/**").authenticated()

                        // Module A APIs: Resource Management
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/resources/**").hasAnyRole("USER", "ADMIN")

                        // Additional protected APIs in this project
                        .requestMatchers("/api/notification-preferences", "/api/notification-preferences/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/bookings", "/api/bookings/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/tickets", "/api/tickets/**").hasAnyRole("USER", "ADMIN")

                        // Any other API route still requires login
                        .requestMatchers("/api/**").authenticated()

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                                .oidcUserService(customOidcUserService)
                        )
                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .exceptionHandling(ex -> ex
                        // Unauthenticated access -> 401
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        // Authenticated but forbidden -> 403
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\":\"Forbidden\"}");
                        })
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "POST"))
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpStatus.NO_CONTENT.value()))
                );

        return http.build();
    }
}
