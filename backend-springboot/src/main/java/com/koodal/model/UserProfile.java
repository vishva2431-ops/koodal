package com.koodal.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_profiles")
public class UserProfile {

    @Id
    private String id;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    private String phone;
    private String currentLocation;
    private String linkedInUrl;
    private String gitHubUrl;
    private String portfolioUrl;

    private List<String> preferredRoles;
    private List<String> preferredLocations;
    private String workArrangement;
    private String experienceLevel;
    private Double experienceYears;
    private Double expectedSalaryMin;
    private Double expectedSalaryMax;
    private Integer noticePeriodDays;
    private String employmentType;

    private List<String> skills;
    private List<String> programmingLanguages;
    private List<String> frameworksAndTools;

    private List<Object> education;
    private List<Object> projects;
    private List<Object> workExperience;
    private List<Object> resumes;

    private Integer completenessScore;
    private Instant updatedAt;
}
