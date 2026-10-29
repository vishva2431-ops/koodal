package com.koodal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
public class ApplicationRecord {

    @Id
    private String id;

    @Indexed
    private String jobId;
    private String jobTitle;
    private String company;
    private String source;
    private String jobUrl;

    private String status; // READY, IN_PROGRESS, SUBMITTED, BLOCKED, FAILED, SUBMISSION_UNKNOWN
    private Instant appliedDate;
    private String resumeVersionId;
    private String resumeName;
    private String confirmationReference;
    private String notes;
    private String followUpDate;
    private String submissionMethod; // ASSISTED, AUTHORIZED_API
    private boolean isResolved;
    private Instant updatedAt;
}
