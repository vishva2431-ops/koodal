/**
 * Normalizes skill strings for robust case-insensitive and variant matching
 * (e.g., "React.js" ~ "ReactJS" ~ "React", "NodeJS" ~ "Node.js", "TS" ~ "TypeScript")
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const s = skill.toLowerCase().trim();
  if (s.includes('react') && !s.includes('react native')) return 'react';
  if (s.includes('next')) return 'next.js';
  if (s.includes('typescript') || s === 'ts') return 'typescript';
  if (s.includes('javascript') || s === 'js') return 'javascript';
  if (s.includes('tailwind')) return 'tailwind css';
  if (s.includes('node')) return 'node.js';
  if (s.includes('express')) return 'express.js';
  if (s.includes('mongo')) return 'mongodb';
  if (s.includes('redux')) return 'redux';
  if (s.includes('rest') || s.includes('api')) return 'rest api';
  if (s.includes('git')) return 'git';
  if (s.includes('jest') || s.includes('unit test')) return 'testing';
  if (s.includes('html')) return 'html5';
  if (s.includes('css')) return 'css3';
  return s;
}

/**
 * Modular Rules-Based Job Matching Engine
 * Operates without external paid AI APIs. Provides 100% deterministic, transparent scoring.
 */
export function calculateJobMatch(job, profile) {
  const safeProfile = profile || {};
  const safeJob = job || {};

  const profileSkills = (safeProfile.skills || []).map(normalizeSkill);
  const userLangSkills = (safeProfile.programmingLanguages || []).map(normalizeSkill);
  const userTools = (safeProfile.frameworksAndTools || []).map(normalizeSkill);
  
  // Also collect skills found in resume
  const resumeSkills = [];
  if (safeProfile.resumes && safeProfile.resumes.length > 0) {
    const activeResume = safeProfile.resumes.find(r => r.id === safeProfile.activeResumeId) || safeProfile.resumes[0];
    if (activeResume && activeResume.parsedSkills) {
      activeResume.parsedSkills.forEach(s => resumeSkills.push(normalizeSkill(s)));
    }
  }

  const allUserSkillSet = new Set([...profileSkills, ...userLangSkills, ...userTools, ...resumeSkills]);

  // 1. Skill Matching (Weight: 45%)
  const jobSkills = safeJob.requiredSkills || [];
  const matchingSkills = [];
  const missingSkills = [];

  jobSkills.forEach(skill => {
    const norm = normalizeSkill(skill);
    let matched = false;
    for (const userSkill of allUserSkillSet) {
      if (userSkill === norm || norm.includes(userSkill) || userSkill.includes(norm)) {
        matched = true;
        break;
      }
    }
    if (matched) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillMatchRatio = jobSkills.length > 0 ? matchingSkills.length / jobSkills.length : 1;
  const skillScore = Math.round(skillMatchRatio * 45);

  // 2. Location & Tamil Nadu Match (Weight: 20%)
  let locationScore = 0;
  const userLocations = (safeProfile.preferredLocations || []).map(l => l.toLowerCase());
  const jobLoc = (safeJob.location || '').toLowerCase();
  
  if (safeJob.workArrangement === 'REMOTE' || jobLoc.includes('remote')) {
    locationScore = 20; // Perfect for remote
  } else {
    const matchedLoc = userLocations.some(pref => 
      jobLoc.includes(pref) || pref.includes(jobLoc) || (pref.includes('chennai') && jobLoc.includes('chennai')) ||
      (pref.includes('coimbatore') && jobLoc.includes('coimbatore')) ||
      (pref.includes('madurai') && jobLoc.includes('madurai')) ||
      (pref.includes('trichy') && (jobLoc.includes('trichy') || jobLoc.includes('tiruchirappalli'))) ||
      (pref.includes('salem') && jobLoc.includes('salem'))
    );
    if (matchedLoc) {
      locationScore = 20;
    } else if ((safeJob.state || '').toLowerCase().includes('tamil nadu') || jobLoc.includes('tamil nadu')) {
      locationScore = 15; // Within Tamil Nadu
    } else {
      locationScore = 5;
    }
  }

  // 3. Experience Match (Weight: 15%)
  let experienceScore = 0;
  const userExp = safeProfile.experienceYears || 0;
  const expMin = safeJob.experienceMin || 0;
  const expMax = safeJob.experienceMax || 10;
  if (userExp >= expMin && userExp <= (expMax + 1.5)) {
    experienceScore = 15; // Sweet spot
  } else if (userExp < expMin) {
    const gap = expMin - userExp;
    experienceScore = gap <= 1 ? 10 : gap <= 2 ? 5 : 0;
  } else {
    // User has more experience
    experienceScore = 12;
  }

  // 4. Role Title Match (Weight: 10%)
  let roleMatchScore = 0;
  const jobTitleNorm = (safeJob.title || '').toLowerCase();
  const matchedRole = (safeProfile.preferredRoles || []).some(role => {
    const r = role.toLowerCase();
    return jobTitleNorm.includes(r) || (r.includes('react') && jobTitleNorm.includes('react')) ||
      (r.includes('frontend') && jobTitleNorm.includes('frontend')) ||
      (r.includes('full stack') && (jobTitleNorm.includes('full stack') || jobTitleNorm.includes('fullstack') || jobTitleNorm.includes('mern')));
  });
  if (matchedRole) {
    roleMatchScore = 10;
  } else {
    roleMatchScore = 4;
  }

  // 5. Work Arrangement Match (Weight: 10%)
  let workArrangementScore = 5;
  if (safeProfile.workArrangement === safeJob.workArrangement) {
    workArrangementScore = 10;
  } else if (safeJob.workArrangement === 'REMOTE' || safeProfile.workArrangement === 'HYBRID') {
    workArrangementScore = 8;
  }

  const overallScore = Math.min(100, Math.max(0, skillScore + locationScore + experienceScore + roleMatchScore + workArrangementScore));

  // Generate clear human-readable explanation
  const explanations = [];
  if (skillMatchRatio >= 0.75) {
    explanations.push(`Strong technical match with ${matchingSkills.length}/${jobSkills.length} required skills satisfied`);
  } else if (skillMatchRatio >= 0.5) {
    explanations.push(`Moderate technical match (${matchingSkills.length}/${jobSkills.length} skills matched; missing ${missingSkills.slice(0, 2).join(', ')})`);
  } else {
    explanations.push(`Missing key required skills: ${missingSkills.join(', ')}`);
  }

  if (locationScore >= 18) {
    explanations.push(`Optimal location alignment with your Tamil Nadu preference (${safeJob.location})`);
  } else {
    explanations.push(`Location is outside primary preferred cities, but within region`);
  }

  if (experienceScore === 15) {
    explanations.push(`Your ${userExp} years of experience fits the requested range (${safeJob.experienceMin}-${safeJob.experienceMax} years)`);
  } else if (userExp < safeJob.experienceMin) {
    explanations.push(`Requires ${safeJob.experienceMin}+ years; profile lists ${userExp} years`);
  }

  const isEligible = overallScore >= 45 && missingSkills.length <= 3;

  return {
    overallScore,
    matchingSkills,
    missingSkills,
    skillScore,
    locationScore,
    experienceScore,
    workArrangementScore,
    roleMatchScore,
    explanation: explanations.join('. ') + '.',
    isEligible,
  };
}

/**
 * Ranks job listings descending by overall match score
 */
export function rankJobsByMatch(jobs, profile) {
  if (!Array.isArray(jobs)) return [];
  return jobs
    .map(job => ({
      job,
      match: calculateJobMatch(job, profile),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);
}
