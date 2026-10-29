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
@Document(collection = "message_templates")
public class MessageTemplate {

    @Id
    private String id;

    private String name;
    private String type; // EMAIL, WHATSAPP, FOLLOW_UP, COVER_LETTER
    private String subject;
    private String body;
    private boolean isDefault;
    private Instant lastModified;
}
