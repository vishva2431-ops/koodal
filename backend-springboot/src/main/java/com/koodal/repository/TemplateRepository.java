package com.koodal.repository;

import com.koodal.model.MessageTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends MongoRepository<MessageTemplate, String> {
    List<MessageTemplate> findByType(String type);
}
