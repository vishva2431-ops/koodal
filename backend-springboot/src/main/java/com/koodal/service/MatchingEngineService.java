package com.koodal.service;

import com.koodal.model.JobListing;
import com.koodal.model.UserProfile;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MatchingEngineService {

    public record MatchResult(
        int overallScore,
        List<String> matchingSkills,
        List<String> missingSkills,
        int skillScore,
        int locationScore,
        int experienceScore,
        String explanation
    ) {}

    public MatchResult calculateMatch(JobListing job, UserProfile profile) {
        Set<String> userSkills = new HashSet<>();
        if (profile.getSkills() != null) {
            profile.getSkills().forEach(s -> userSkills.add(normalize(s)));
        }

        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        if (job.getRequiredSkills() != null) {
            for (String req : job.getRequiredSkills()) {
                String normReq = normalize(req);
                boolean isMatch = userSkills.contains(normReq) ||
                        userSkills.stream().anyMatch(us -> us.contains(normReq) || normReq.contains(us));
                if (isMatch) {
                    matching.add(req);
                } else {
                    missing.add(req);
                }
            }
        }

        int totalSkills = (job.getRequiredSkills() != null && !job.getRequiredSkills().isEmpty()) 
                ? job.getRequiredSkills().size() : 1;
        double skillRatio = (double) matching.size() / totalSkills;
        int skillScore = (int) Math.round(skillRatio * 45);

        // Location match (Tamil Nadu)
        int locationScore = 5;
        if ("REMOTE".equalsIgnoreCase(job.getWorkArrangement())) {
            locationScore = 20;
        } else if (job.getLocation() != null) {
            String locLower = job.getLocation().toLowerCase();
            if (locLower.contains("chennai") || locLower.contains("coimbatore") || locLower.contains("madurai") || locLower.contains("trichy") || locLower.contains("salem")) {
                locationScore = 20;
            } else if (locLower.contains("tamil nadu")) {
                locationScore = 15;
            }
        }

        // Experience match
        int experienceScore = 12;
        if (profile.getExperienceYears() != null && job.getExperienceMin() != null) {
            double userExp = profile.getExperienceYears();
            if (userExp >= job.getExperienceMin() && (job.getExperienceMax() == null || userExp <= job.getExperienceMax() + 1.5)) {
                experienceScore = 15;
            }
        }

        int overallScore = Math.min(100, skillScore + locationScore + experienceScore + 10);

        String explanation = String.format(
            "Rules-based match: %d/%d technical skills satisfied. Location in Tamil Nadu (%s). Experience alignment evaluated.",
            matching.size(), totalSkills, job.getLocation()
        );

        return new MatchResult(overallScore, matching, missing, skillScore, locationScore, experienceScore, explanation);
    }

    private String normalize(String skill) {
        return skill == null ? "" : skill.toLowerCase().trim().replaceAll("[^a-z0-9]", "");
    }
}
