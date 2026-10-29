package com.koodal.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "job_listings")
public class JobListing {

    @Id
    private String id;

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String company;

    @NotBlank(message = "Location is required")
    private String location;

    private String state; // Tamil Nadu
    private String description;

    private List<String> requiredSkills;
    private Double experienceMin;
    private Double experienceMax;
    private Double salaryMin;
    private Double salaryMax;
    private String salaryDisplay;

    private String employmentType; // FULL_TIME, CONTRACT, INTERNSHIP
    private String workArrangement; // REMOTE, HYBRID, ON_SITE
    private String source; // NAUKRI, LINKEDIN, INDEED, COMPANY_CAREER

    @Indexed(unique = true)
    private String originalUrl;
    private String directApplicationUrl;

    private Instant dateDiscovered;
    private String applicationMethod;
    private boolean isDemoData;
    private boolean isOpen;
    private String contactEmail;
}
