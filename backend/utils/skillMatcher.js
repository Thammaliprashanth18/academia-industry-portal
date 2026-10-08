/**
 * Explainable Skill Matching Utility
 * Calculates exact skill match percentage, matched skills, missing skills, and score breakdown.
 */

function calculateSkillMatch(studentSkillNames = [], opportunitySkillNames = []) {
  if (!opportunitySkillNames || opportunitySkillNames.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      totalSkills: 0,
      matchedCount: 0,
      isExactMatch: true
    };
  }

  // Normalize skill names (case-insensitive, trimmed)
  const studentSkillSet = new Set(
    studentSkillNames.map(s => (typeof s === 'string' ? s : s.name || '').trim().toLowerCase())
  );

  const matchedSkills = [];
  const missingSkills = [];

  opportunitySkillNames.forEach(skill => {
    const skillName = typeof skill === 'string' ? skill.trim() : (skill.name || '').trim();
    const normalized = skillName.toLowerCase();

    if (studentSkillSet.has(normalized)) {
      matchedSkills.push(skillName);
    } else {
      missingSkills.push(skillName);
    }
  });

  const total = opportunitySkillNames.length;
  const matchedCount = matchedSkills.length;
  const matchPercentage = Math.round((matchedCount / total) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    totalSkills: total,
    matchedCount,
    isExactMatch: matchedCount === total
  };
}

module.exports = {
  calculateSkillMatch
};
