// Helper to safely parse services JSON or text
export const parseServices = (val) => {
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch (e) {
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
};

// Map database project row to frontend JSON format
export const mapRowToProject = (row, categories = []) => {
  return {
    id: row.id,
    title: row.title,
    status: row.status || 'published',
    category: categories[0] || '',
    categories: categories,
    tagline: row.tagline || '',
    stat: row.stat || '',
    statLabel: row.stat_label || '',
    statDetail: row.stat_detail || '',
    image: row.image || '',
    description: row.description || '',
    details: {
      client: row.client || '',
      services: parseServices(row.services),
      challenge: row.challenge || '',
      challengeImage: row.challenge_image || '',
      strategy: row.strategy || '',
      strategyImage: row.strategy_image || '',
      results: row.results || '',
      resultsImage: row.results_image || '',
      testimonial: {
        text: row.testimonial_text || '',
        author: row.testimonial_author || '',
        role: row.testimonial_role || ''
      }
    }
  };
};
