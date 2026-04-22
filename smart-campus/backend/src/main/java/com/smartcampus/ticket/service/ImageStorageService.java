package com.smartcampus.ticket.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final int MAX_IMAGES = 3;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Saves up to {@value #MAX_IMAGES} valid image files and returns their accessible URL paths.
     */
    public List<String> storeImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return List.of();

        List<String> urls = new ArrayList<>();
        int count = 0;

        for (MultipartFile file : files) {
            if (count >= MAX_IMAGES) break;
            if (file == null || file.isEmpty()) continue;

            validateFile(file);

            try {
                Path ticketsDir = Paths.get(uploadDir, "tickets");
                Files.createDirectories(ticketsDir);

                String extension = getExtension(file.getOriginalFilename());
                String filename = UUID.randomUUID() + "." + extension;
                Path destination = ticketsDir.resolve(filename);
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

                // Return a URL path that Spring serves as a static resource
                urls.add("/uploads/tickets/" + filename);
                count++;
            } catch (IOException e) {
                throw new IllegalStateException("Failed to store image: " + file.getOriginalFilename(), e);
            }
        }
        return urls;
    }

    /** Deletes a stored file by its URL path (best-effort, no exception on missing). */
    public void deleteImage(String urlPath) {
        if (urlPath == null || urlPath.isBlank()) return;
        try {
            // Strip leading slash so Path resolution is relative to uploadDir root
            String relative = urlPath.startsWith("/uploads/") ? urlPath.substring(1) : urlPath;
            Path file = Paths.get(relative);
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
        }
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File '" + file.getOriginalFilename() + "' exceeds the 5 MB limit.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "File type '" + contentType + "' is not allowed. Accepted: jpg, png, gif, webp.");
        }
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "jpg";
        return originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
    }
}
