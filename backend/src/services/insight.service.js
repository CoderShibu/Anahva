import prisma from '../config/db.js';
import journalService from './journal.service.js';

/**
 * Insight Service
 * Provides pattern awareness, NOT behavioral prediction
 * No scoring, no rankings, no labels
 */
class InsightService {
  /**
   * Generate narrative insights from journal metadata
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Narrative insights
   */
  async generateInsights(sessionId) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Get journal metadata (counts, timestamps only)
    const journals = await journalService.getJournals(sessionId, 100, 0);
    const journalCount = journals.length;

    if (journalCount === 0) {
      return {
        insights: [],
        message: 'Start journaling to see insights about your journey.',
      };
    }

    // Analyze patterns from metadata only (no content access)
    const patterns = this.analyzePatterns(journals);

    // Create narrative insights (not scores or labels)
    const insights = this.createNarrativeInsights(patterns, journalCount);

    // Store insight metadata
    await prisma.insight.create({
      data: {
        session_id: sessionId,
        insight_type: 'pattern',
        metadata: JSON.stringify({
          patterns,
          journalCount,
          generatedAt: new Date().toISOString(),
        }),
      },
    });

    return {
      insights,
      patterns,
      journalCount,
    };
  }

  /**
   * Analyze patterns from journal metadata
   * @param {Array} journals - Journal entries (metadata only)
   * @returns {Object} Pattern analysis
   */
  analyzePatterns(journals) {
    if (!journals || journals.length === 0) {
      return {};
    }

    // Group by day of week
    const dayOfWeekCounts = {};
    const hourCounts = {};
    const weeklyActivity = {};

    journals.forEach((journal) => {
      const date = new Date(journal.created_at);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      const week = this.getWeekNumber(date);

      dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      weeklyActivity[week] = (weeklyActivity[week] || 0) + 1;
    });

    // Find most active times (not for engagement optimization, just awareness)
    const mostActiveDay = Object.keys(dayOfWeekCounts).reduce((a, b) =>
      dayOfWeekCounts[a] > dayOfWeekCounts[b] ? a : b
    );
    const mostActiveHour = Object.keys(hourCounts).reduce((a, b) =>
      hourCounts[a] > hourCounts[b] ? a : b
    );

    return {
      dayOfWeekCounts,
      hourCounts,
      weeklyActivity,
      mostActiveDay: parseInt(mostActiveDay),
      mostActiveHour: parseInt(mostActiveHour),
      totalEntries: journals.length,
    };
  }

  /**
   * Create narrative insights (not scores)
   * @param {Object} patterns - Pattern analysis
   * @param {number} journalCount - Total journal count
   * @returns {Array} Narrative insights
   */
  createNarrativeInsights(patterns, journalCount) {
    const insights = [];

    // Journaling frequency awareness
    if (journalCount >= 10) {
      insights.push({
        type: 'frequency',
        narrative: `You've been journaling regularly. This consistent practice shows your commitment to self-reflection.`,
      });
    } else if (journalCount >= 5) {
      insights.push({
        type: 'frequency',
        narrative: `You're building a journaling habit. Each entry is a step toward greater self-awareness.`,
      });
    }

    // Time pattern awareness (not optimization)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (patterns.mostActiveDay !== undefined) {
      insights.push({
        type: 'timing',
        narrative: `You tend to journal more on ${dayNames[patterns.mostActiveDay]}. This might be when you naturally feel the need to reflect.`,
      });
    }

    // Activity awareness
    if (Object.keys(patterns.weeklyActivity).length >= 4) {
      insights.push({
        type: 'consistency',
        narrative: `Your journaling spans multiple weeks, showing a sustained practice of reflection.`,
      });
    }

    return insights;
  }

  /**
   * Get week number from date
   * @param {Date} date - Date object
   * @returns {string} Week identifier
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return `${d.getUTCFullYear()}-W${Math.ceil((((d - yearStart) / 86400000) + 1) / 7)}`;
  }

  /**
   * Get insights history
   * @param {string} sessionId - Session ID
   * @param {number} limit - Maximum number of insights
   * @returns {Promise<Array>} Insight history
   */
  async getInsightsHistory(sessionId, limit = 10) {
    if (!sessionId) {
      return [];
    }

    const insights = await prisma.insight.findMany({
      where: {
        session_id: sessionId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    });

    return insights;
  }
}

const insightService = new InsightService();

export default insightService;

