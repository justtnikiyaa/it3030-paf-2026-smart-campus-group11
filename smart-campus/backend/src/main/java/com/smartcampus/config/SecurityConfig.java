package com.smartcampus.config;

import com.smartcampus.security.CustomOAuth2UserService;
import com.smartcampus.security.OAuth2LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/notifications/my/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/notifications/*/read").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/notifications").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/notifications", "/api/notifications/*").hasRole("ADMIN")
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .logout(logout -> logout.logoutSuccessUrl("/"));

        return http.build();
    }
}
