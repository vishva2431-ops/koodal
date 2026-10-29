package com.koodal.repository;

import com.koodal.model.ApplicationRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<ApplicationRecord, String> {
    List<ApplicationRecord> findByStatus(String status);
    List<ApplicationRecord> findByJobId(String jobId);
}
