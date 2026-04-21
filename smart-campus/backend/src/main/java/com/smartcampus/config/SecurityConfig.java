package com.smartcampus.config;

import com.smartcampus.security.CustomOAuth2UserService;
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
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final com.smartcampus.user.service.UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                        // Serve uploaded images publicly
                        .requestMatchers("/uploads/**").permitAll()

                        // Admin-only APIs
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Technician dashboard – assigned tickets list
                        .requestMatchers("/api/tickets/assigned").hasAnyRole("TECHNICIAN", "ADMIN")

                        // Status update – technician or admin
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/tickets/*/status")
                                .hasAnyRole("TECHNICIAN", "ADMIN")

                        // Module D APIs: notifications for USER/ADMIN
                        .requestMatchers("/api/notifications/**").hasAnyRole("USER", "ADMIN")

                        // Auth APIs: authenticated users
                        .requestMatchers("/api/auth/**").authenticated()

                        // Additional protected APIs in this project
                        .requestMatchers("/api/notification-preferences", "/api/notification-preferences/**").hasAnyRole("USER", "ADMIN", "TECHNICIAN")
                        .requestMatchers("/api/bookings", "/api/bookings/**").hasAnyRole("USER", "ADMIN", "TECHNICIAN")
                        .requestMatchers("/api/tickets", "/api/tickets/**").hasAnyRole("USER", "ADMIN", "TECHNICIAN")

                        // Any other API route still requires login
                        .requestMatchers("/api/**").authenticated()

                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                                .oidcUserService(this.oidcUserService())
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
    @Bean
    public org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService oidcUserService() {
        return new org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService() {
            @Override
            public org.springframework.security.oauth2.core.oidc.user.OidcUser loadUser(org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest userRequest) throws org.springframework.security.oauth2.core.OAuth2AuthenticationException {
                org.springframework.security.oauth2.core.oidc.user.OidcUser oidcUser = super.loadUser(userRequest);

                String googleId = oidcUser.getSubject();
                String email = oidcUser.getEmail();
                String fullName = oidcUser.getFullName();
                String pictureUrl = oidcUser.getPicture();

                com.smartcampus.user.entity.User user = userService.findOrCreateGoogleUser(googleId, email, fullName, pictureUrl);

                java.util.Set<org.springframework.security.core.GrantedAuthority> authorities = new java.util.HashSet<>(oidcUser.getAuthorities());
                user.getRoles().forEach(role -> authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role.getName().name())));

                return new org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser(authorities, oidcUser.getIdToken(), oidcUser.getUserInfo());
            }
        };
    }
}
