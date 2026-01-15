import insightService from '../services/insight.service.js';
import journalService from '../services/journal.service.js';

/**
 * Insight Controller
 * Handles insights generation (pattern awareness only)
 */
class InsightController {
      /**
       * Health Improvement Graph (Weekly Trend)
       * GET /insights/trend?range=weekly or range=8weeks
       */
      async getTrendInsights(req, res) {
        try {
          const { session_id } = req.session;
          const range = req.query.range || 'weekly';
          const journals = await journalService.getJournals(session_id, 500, 0);
          if (range === 'weekly') {
            // Count journaling consistency for current week
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
            startOfWeek.setUTCHours(0,0,0,0);
            const entriesThisWeek = journals.filter(j => {
              const jd = new Date(j.created_at);
              return jd >= startOfWeek && jd <= now;
            });
            // Compare with previous week
            const startOfPrevWeek = new Date(startOfWeek);
            startOfPrevWeek.setUTCDate(startOfWeek.getUTCDate() - 7);
            const endOfPrevWeek = new Date(startOfWeek);
            endOfPrevWeek.setUTCDate(startOfWeek.getUTCDate() - 1);
            const entriesPrevWeek = journals.filter(j => {
              const jd = new Date(j.created_at);
              return jd >= startOfPrevWeek && jd <= endOfPrevWeek;
            });
            let direction = 'stable';
            if (entriesThisWeek.length > entriesPrevWeek.length) direction = 'improving';
            if (entriesThisWeek.length < entriesPrevWeek.length) direction = 'declining';
            res.json({ direction, based_on: 'journal_frequency', data_points: entriesThisWeek.length });
          } else if (range === '8weeks') {
            // 8-Week Journey Graph
            const now = new Date();
            const weeks = [];
            for (let i = 0; i < 8; i++) {
              const startOfWeek = new Date(now);
              startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay() - (7 * i));
              startOfWeek.setUTCHours(0,0,0,0);
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
              const entries = journals.filter(j => {
                const jd = new Date(j.created_at);
                return jd >= startOfWeek && jd <= endOfWeek;
              });
              let direction = 'no_data';
              if (entries.length > 0) {
                direction = 'stable';
                // Optionally, compare with previous week for trend
                if (i > 0) {
                  const prevWeek = weeks[i-1];
                  if (prevWeek && prevWeek.entries !== undefined) {
                    if (entries.length > prevWeek.entries) direction = 'improving';
                    if (entries.length < prevWeek.entries) direction = 'declining';
                  }
                }
              }
              weeks.push({ week: 8-i, direction, entries: entries.length });
            }
            res.json({ weeks: weeks.reverse().map(w => ({ week: w.week, direction: w.direction })) });
          } else {
            res.status(400).json({ error: 'Invalid range' });
          }
        } catch (error) {
          console.error('Trend insights error:', error);
          res.status(500).json({ error: 'Failed to get trend insights' });
        }
      }
    /**
     * Weekly Emotional Journey
     * GET /insights/weekly
     */
    async getWeeklyInsights(req, res) {
      try {
        const { session_id } = req.session;
        // Query journals for last 7 days
        const journals = await journalService.getJournals(session_id, 100, 0);
        // Group by calendar day (UTC)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = {};
        // Get today in UTC
        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        // Map for last 7 days
        for (let i = 0; i < 7; i++) {
          const d = new Date(todayUTC);
          d.setUTCDate(todayUTC.getUTCDate() - (6 - i));
          const dayName = days[d.getUTCDay()];
          // Find journals for this day
          const entries = journals.filter(j => {
            const jd = new Date(j.created_at);
            return jd.getUTCFullYear() === d.getUTCFullYear() && jd.getUTCMonth() === d.getUTCMonth() && jd.getUTCDate() === d.getUTCDate();
          });
          if (entries.length === 0) {
            result[dayName] = null;
          } else {
            // Aggregate: if allow_ai_memory, classify with AI (stubbed here)
            let state = 'unknown';
            let confidence = 'low';
            if (entries.some(e => e.allow_ai_memory)) {
              // TODO: Call Gemini API for summarization/classification
              state = 'calm'; // Example only, replace with real AI result
              confidence = 'low';
            }
            result[dayName] = { state, confidence };
          }
        }
        res.json(result);
      } catch (error) {
        console.error('Weekly insights error:', error);
        res.status(500).json({ error: 'Failed to get weekly insights' });
      }
    }
  /**
   * Generate insights
   * GET /insights/generate
   */
  async generateInsights(req, res) {
    try {
      const { session_id } = req.session;

      const insights = await insightService.generateInsights(session_id);

      res.json({
        success: true,
        ...insights,
      });
    } catch (error) {
      console.error('Generate insights error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to generate insights',
      });
    }
  }

  /**
   * Get insights history
   * GET /insights/history
   */
  async getInsightsHistory(req, res) {
    try {
      const { session_id } = req.session;
      const limit = parseInt(req.query.limit || '10', 10);

      const insights = await insightService.getInsightsHistory(session_id, limit);

      res.json({
        success: true,
        insights,
      });
    } catch (error) {
      console.error('Get insights history error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve insights history',
      });
    }
  }
}

const insightController = new InsightController();

export default insightController;

