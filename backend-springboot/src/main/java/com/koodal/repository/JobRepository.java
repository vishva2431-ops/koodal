package com.koodal.repository;

import com.koodal.model.JobListing;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends MongoRepository<JobListing, String> {
    List<JobListing> findByLocationContainingIgnoreCase(String location);
    List<JobListing> findBySource(String source);
    Optional<JobListing> findByOriginalUrl(String originalUrl);
}
