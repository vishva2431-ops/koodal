package com.koodal.controller;

import com.koodal.model.UserProfile;
import com.koodal.repository.ProfileRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<UserProfile> getProfile() {
        List<UserProfile> profiles = profileRepository.findAll();
        if (profiles.isEmpty()) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(profiles.get(0));
    }

    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@Valid @RequestBody UserProfile profile) {
        profile.setUpdatedAt(Instant.now());
        UserProfile saved = profileRepository.save(profile);
        return ResponseEntity.ok(saved);
    }
}
