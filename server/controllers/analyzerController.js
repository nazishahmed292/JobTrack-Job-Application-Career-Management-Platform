const analyzeJobDescription = async (req, res) => {
  const { jobDescription, profileSkills = [] } = req.body;

  if (!jobDescription || typeof jobDescription !== 'string') {
    return res.status(400).json({ success: false, message: 'Job description is required' });
  }

  const normalizeText = (text) => text.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ');
  const text = normalizeText(jobDescription);
  const tokens = text.split(/\s+/).filter(Boolean);

  const skillKeywords = [
    'javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'typescript', 'python', 'aws', 'docker',
    'graphql', 'api', 'redux', 'tailwind', 'css', 'html', 'rest', 'microservices', 'redis', 'testing',
    'frontend', 'backend', 'ui', 'ux', 'agile', 'jira', 'java', 'c#', 'c++', 'ruby', 'go', 'php', 'postgres',
    'mysql', 'nextjs', 'vue', 'angular', 'machine learning', 'ai', 'data analysis', 'system design',
    'team leadership', 'communication', 'product management'
  ];

  const extractedSkills = [...new Set(skillKeywords.filter((keyword) => text.includes(keyword.toLowerCase())))];
  const technologies = extractedSkills.filter((word) => /[a-z]/.test(word) && word.length > 2);
  const experienceKeywords = ['5+ years', '3+ years', 'senior', 'junior', 'mid-level', 'lead', 'manager', 'entry level'];
  const educationKeywords = ['bachelor', 'master', 'degree', 'computer science', 'engineering', 'mba'];

  const normalizedProfileSkills = (profileSkills || []).map((skill) => skill.toLowerCase());
  const matchingSkills = extractedSkills.filter((skill) => normalizedProfileSkills.includes(skill.toLowerCase()));
  const missingSkills = extractedSkills.filter((skill) => !normalizedProfileSkills.includes(skill.toLowerCase()));
  const matchPercentage = extractedSkills.length
    ? Math.round((matchingSkills.length / extractedSkills.length) * 100)
    : 0;

  const result = {
    success: true,
    extractedSkills,
    technologies,
    keywords: [...new Set(tokens.filter((token) => token.length > 3).slice(0, 30))],
    experienceRequirements: experienceKeywords.filter((keyword) => text.includes(keyword.toLowerCase())),
    educationRequirements: educationKeywords.filter((keyword) => text.includes(keyword.toLowerCase())),
    matches: {
      matchingSkills,
      missingSkills,
      matchPercentage,
    },
  };

  return res.status(200).json(result);
};

export { analyzeJobDescription };
