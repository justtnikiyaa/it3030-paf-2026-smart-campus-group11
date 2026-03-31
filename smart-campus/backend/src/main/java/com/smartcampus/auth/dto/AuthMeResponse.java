package com.smartcampus.auth.dto;

import java.util.Set;

public record AuthMeResponse(
        Long id,
        String email,
        String fullName,
        String pictureUrl,
        Set<String> roles
) {
}
