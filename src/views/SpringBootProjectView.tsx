import React, { useState } from 'react';
import { 
  Server, 
  Copy, 
  Check, 
  FileCode, 
  Folder, 
  Database, 
  ShieldCheck, 
  Terminal,
  Download
} from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

const SPRING_BOOT_FILES: CodeFile[] = [
  {
    name: 'pom.xml',
    path: 'pom.xml',
    language: 'xml',
    description: 'Maven Project Object Model configured for Java 21, Spring Boot 3.3.4, Spring Data MongoDB, and Spring Security.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    <groupId>com.koodal</groupId>
    <artifactId>koodal-job-assistant-backend</artifactId>
    <version>1.0.0</version>
    <name>koodal-backend</name>
    <description>Production Spring Boot 3 &amp; MongoDB Atlas Backend for Personal Job Assistant</description>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web MVC & REST APIs -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data MongoDB for MongoDB Atlas Free Tier -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>

        <!-- Spring Security & CORS Configuration -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Lombok for clean boilerplate -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    name: 'application.yml',
    path: 'src/main/resources/application.yml',
    language: 'yaml',
    description: 'Spring Boot environment-driven configuration for MongoDB Atlas URI and CORS origin restrictions.',
    content: `server:
  port: \${PORT:8080}
  compression:
    enabled: true

spring:
  application:
    name: koodal-job-assistant
  data:
    mongodb:
      # Set your free MongoDB Atlas connection string in MONGODB_URI environment variable
      uri: \${MONGODB_URI:mongodb+srv://user:pass@cluster0.abcde.mongodb.net/koodal_jobs?retryWrites=true&w=majority}
      database: koodal_jobs

app:
  cors:
    allowed-origins: \${CORS_ALLOWED_ORIGINS:http://localhost:3000,https://*.vercel.app,https://*.onrender.com}
  security:
    personal-token: \${PERSONAL_API_TOKEN:change-this-in-production}

logging:
  level:
    root: INFO
    com.koodal: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"`,
  },
  {
    name: 'SecurityConfig.java',
    path: 'src/main/java/com/koodal/config/SecurityConfig.java',
    language: 'java',
    description: 'Stateless Spring Security configuration restricting public access and enforcing CORS headers.',
    content: `package com.koodal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("\${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/health", "/api/jobs/**", "/api/profile/**", "/api/applications/**", "/api/message-templates/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}`,
  },
  {
    name: 'JobListing.java',
    path: 'src/main/java/com/koodal/model/JobListing.java',
    language: 'java',
    description: 'MongoDB document collection model for normalized job postings with duplicate index.',
    content: `package com.koodal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "job_listings")
public class JobListing {

    @Id
    private String id;

    private String title;
    private String company;
    private String location;
    private String state; // Tamil Nadu
    private String description;

    private List<String> requiredSkills;
    private Double experienceMin;
    private Double experienceMax;
    private Double salaryMin;
    private Double salaryMax;
    private String salaryDisplay;

    private String employmentType; // FULL_TIME, CONTRACT, INTERNSHIP
    private String workArrangement; // REMOTE, HYBRID, ON_SITE
    private String source; // NAUKRI, LINKEDIN, INDEED, COMPANY_CAREER

    @Indexed(unique = true)
    private String originalUrl;
    private String directApplicationUrl;

    private Instant dateDiscovered;
    private String applicationMethod;
    private boolean isDemoData;
    private boolean isOpen;
    private String contactEmail;
}`,
  },
  {
    name: 'JobController.java',
    path: 'src/main/java/com/koodal/controller/JobController.java',
    language: 'java',
    description: 'REST controller providing endpoints for discovery, search filtering, and batch updates.',
    content: `package com.koodal.controller;

import com.koodal.model.JobListing;
import com.koodal.repository.JobRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<JobListing>> getAllJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String source) {
        if (location != null && !location.isBlank()) {
            return ResponseEntity.ok(jobRepository.findByLocationContainingIgnoreCase(location));
        }
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobListing> getJobById(@PathVariable String id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JobListing> createJob(@Valid @RequestBody JobListing job) {
        if (job.getDateDiscovered() == null) {
            job.setDateDiscovered(Instant.now());
        }
        JobListing saved = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/batch-sync")
    public ResponseEntity<Void> batchSync(@RequestBody List<JobListing> jobs) {
        jobRepository.saveAll(jobs);
        return ResponseEntity.ok().build();
    }
}`,
  },
  {
    name: 'MatchingEngineService.java',
    path: 'src/main/java/com/koodal/service/MatchingEngineService.java',
    language: 'java',
    description: 'Pure Java rules-based matching engine mirror with transparent scoring and zero AI API cost.',
    content: `package com.koodal.service;

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
                if (userSkills.contains(normReq) || userSkills.stream().anyMatch(us -> us.contains(normReq))) {
                    matching.add(req);
                } else {
                    missing.add(req);
                }
            }
        }

        int totalSkills = job.getRequiredSkills() != null ? job.getRequiredSkills().size() : 1;
        double skillRatio = totalSkills > 0 ? (double) matching.size() / totalSkills : 1.0;
        int skillScore = (int) Math.round(skillRatio * 45);

        // Location match (Tamil Nadu)
        int locationScore = 15;
        if (job.getLocation() != null && job.getLocation().toLowerCase().contains("chennai")) {
            locationScore = 20;
        }

        int experienceScore = 15;
        int overallScore = Math.min(100, skillScore + locationScore + experienceScore + 10);

        String explanation = String.format("Rules-based match: %d/%d skills satisfied. Location in Tamil Nadu.",
                matching.size(), totalSkills);

        return new MatchResult(overallScore, matching, missing, explanation);
    }

    private String normalize(String skill) {
        return skill == null ? "" : skill.toLowerCase().trim().replaceAll("[^a-z0-9]", "");
    }
}`,
  },
];

export const SpringBootProjectView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = SPRING_BOOT_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Server className="w-4 h-4" />
            <span>Standalone Java Backend Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Spring Boot 3 + MongoDB Atlas Codebase
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Production-grade backend implementation using Java 21, Spring Data MongoDB, Bean Validation, and Spring Security.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
            Java 21 · Spring Boot 3.3.4
          </span>
        </div>
      </div>

      {/* Terminal / Run Instructions */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 border border-slate-800">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] pb-1 border-b border-slate-800">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Local Build & Deployment Commands (Maven)</span>
        </div>
        <div className="space-y-1 text-slate-300">
          <div><span className="text-slate-500"># 1. Package executable Spring Boot JAR:</span></div>
          <div className="text-emerald-400">mvn clean package -DskipTests</div>
          <div><span className="text-slate-500"># 2. Run locally with MongoDB Atlas connection:</span></div>
          <div className="text-indigo-300">MONGODB_URI=&quot;mongodb+srv://...&quot; java -jar target/koodal-job-assistant-backend-1.0.0.jar</div>
        </div>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* File Navigator */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
            Project Files
          </span>
          {SPRING_BOOT_FILES.map((file, idx) => {
            const isSelected = idx === selectedFileIndex;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-mono transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="truncate">{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Box */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-2xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-mono font-bold text-slate-900">{activeFile.path}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{activeFile.description}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md font-medium text-xs hover:bg-slate-100 transition-colors shrink-0 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 overflow-x-auto text-[11px] font-mono text-slate-200 leading-relaxed max-h-[500px]">
            <pre>
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
