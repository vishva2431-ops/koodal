package com.koodal.controller;

import com.koodal.model.JobListing;
import com.koodal.repository.JobRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<JobListing>> getAllJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String source) {
        if (location != null && !location.isBlank()) {
            return ResponseEntity.ok(jobRepository.findByLocationContainingIgnoreCase(location));
        }
        if (source != null && !source.isBlank()) {
            return ResponseEntity.ok(jobRepository.findBySource(source));
        }
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobListing> getJobById(@PathVariable String id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JobListing> createJob(@Valid @RequestBody JobListing job) {
        if (job.getDateDiscovered() == null) {
            job.setDateDiscovered(Instant.now());
        }
        JobListing saved = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/batch-sync")
    public ResponseEntity<Void> batchSync(@RequestBody List<JobListing> jobs) {
        jobRepository.saveAll(jobs);
        return ResponseEntity.ok().build();
    }
}
