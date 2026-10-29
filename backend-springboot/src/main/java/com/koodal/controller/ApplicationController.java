package com.koodal.controller;

import com.koodal.model.ApplicationRecord;
import com.koodal.model.ErrorLogRecord;
import com.koodal.repository.ApplicationRepository;
import com.koodal.repository.ErrorLogRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final ErrorLogRepository errorLogRepository;

    @GetMapping
    public ResponseEntity<List<ApplicationRecord>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<ApplicationRecord> createApplication(@Valid @RequestBody ApplicationRecord record) {
        if (record.getAppliedDate() == null) {
            record.setAppliedDate(Instant.now());
        }
        record.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(applicationRepository.save(record));
    }

    @PostMapping("/batch-sync")
    public ResponseEntity<Void> batchSync(@RequestBody List<ApplicationRecord> records) {
        applicationRepository.saveAll(records);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/errors")
    public ResponseEntity<List<ErrorLogRecord>> getErrorLogs() {
        return ResponseEntity.ok(errorLogRepository.findAll());
    }

    @PostMapping("/errors/sync")
    public ResponseEntity<Void> syncErrors(@RequestBody List<ErrorLogRecord> errors) {
        errorLogRepository.saveAll(errors);
        return ResponseEntity.ok().build();
    }
}
