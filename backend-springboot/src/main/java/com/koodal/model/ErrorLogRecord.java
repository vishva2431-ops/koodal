package com.koodal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "error_logs")
public class ErrorLogRecord {

    @Id
    private String id;

    private String applicationId;
    private String jobId;
    private String jobTitle;
    private String company;
    private String source;
    private Instant timestamp;
    private String stage; // PREREQUISITE_CHECK, FORM_NAVIGATION, DOCUMENT_UPLOAD, SUBMISSION_VERIFICATION, PORTAL_AUTH
    private String errorCode;
    private String errorMessage;
    private String evidence;
    private boolean rootCauseConfirmed;
    private String causeDescription;
    private String recoveryAction;
    private boolean isSafeToRetry;
    private String status;
}
