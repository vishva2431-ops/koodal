package com.koodal.repository;

import com.koodal.model.ErrorLogRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorLogRepository extends MongoRepository<ErrorLogRecord, String> {
    List<ErrorLogRecord> findByApplicationId(String applicationId);
    List<ErrorLogRecord> findByStatus(String status);
}
