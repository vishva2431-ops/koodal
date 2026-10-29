package com.koodal.controller;

import com.koodal.model.MessageTemplate;
import com.koodal.repository.TemplateRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/message-templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateRepository templateRepository;

    @GetMapping
    public ResponseEntity<List<MessageTemplate>> getAllTemplates() {
        return ResponseEntity.ok(templateRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<MessageTemplate> saveTemplate(@Valid @RequestBody MessageTemplate template) {
        template.setLastModified(Instant.now());
        return ResponseEntity.ok(templateRepository.save(template));
    }

    @PostMapping("/batch-sync")
    public ResponseEntity<Void> batchSync(@RequestBody List<MessageTemplate> templates) {
        templateRepository.saveAll(templates);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        templateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
