import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { insightsAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { TrendingUp, Heart, Sparkles, LineChart } from 'lucide-react';

const Insights = () => {
  const { t } = useLanguage();
  const [showHealthGraph, setShowHealthGraph] = useState(false);
  const [weeklyInsights, setWeeklyInsights] = useState(null);
  const [trendWeekly, setTrendWeekly] = useState(null);
  const [trend8Weeks, setTrend8Weeks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const weeklyData = await insightsAPI.weekly();
        setWeeklyInsights(weeklyData);
        const trendData = await insightsAPI.trend('weekly');
        setTrendWeekly(trendData);
        const trend8Data = await insightsAPI.trend('8weeks');
        setTrend8Weeks(trend8Data);
      } catch (err) {
        console.error('Failed to load insights:', err);
        setError('Failed to load insights.');
      }
      setLoading(false);
    };
    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-2xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display text-foreground">
            {t('insights')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('insightTitle')}
          </p>
        </motion.div>

        <motion.div
          className="card-3d p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl text-foreground">
              {t('weeklyMood')}
            </h2>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-muted-foreground">{error}</p>
          ) : !weeklyInsights || Object.values(weeklyInsights).every(v => v === null) ? (
            <p className="text-muted-foreground">No data yet. Start journaling to see insights.</p>
          ) : (
            <div className="flex items-end justify-between gap-2 h-40 mb-4">
              {Object.entries(weeklyInsights).map(([day, value], index) => (
                <motion.div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <motion.div
                    className={`w-full max-w-8 rounded-t-lg ${value ? 'bg-gradient-to-t from-primary/40 to-primary/80' : 'bg-secondary/30'} relative group cursor-pointer`}
                    initial={{ height: 0 }}
                    animate={{ height: value ? '80%' : '10%' }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.6, ease: 'easeOut' }}
                    whileHover={{ scale: 1.05 }}
                    style={{ boxShadow: value ? '0 0 20px hsl(30 45% 55% / 0.3)' : 'none' }}
                  >
                    {value && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-charcoal-elevated px-2 py-1 rounded text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {value.state} ({value.confidence})
                      </div>
                    )}
                  </motion.div>
                  <span className="text-xs text-muted-foreground">{day}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setShowHealthGraph(!showHealthGraph)}
            className="w-full card-3d p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LineChart className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{t('healthImprovementGraph')}</span>
            </div>
            <motion.div
              animate={{ rotate: showHealthGraph ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>

          {showHealthGraph && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 card-3d p-6 overflow-hidden"
            >
              <h3 className="font-display text-lg text-foreground mb-4">{t('healthImprovementGraph')}</h3>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : error ? (
                <p className="text-muted-foreground">{error}</p>
              ) : !trendWeekly ? (
                <p className="text-muted-foreground">No data yet. Start journaling to see insights.</p>
              ) : (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">{trendWeekly.direction}</span>
                  <span className="text-xs text-muted-foreground">({trendWeekly.based_on}, {trendWeekly.data_points} entries)</span>
                </div>
              )}
              {trend8Weeks && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">8-Week Journey</h4>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {trend8Weeks.weeks.map((w, idx) => (
                      <motion.div
                        key={w.week}
                        className="flex-1 flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <motion.div
                          className={`w-full max-w-8 rounded-t-lg ${w.direction !== 'no_data' ? 'bg-gradient-to-t from-primary/40 to-primary/80' : 'bg-secondary/30'} relative group`}
                          initial={{ height: 0 }}
                          animate={{ height: w.direction !== 'no_data' ? '80%' : '10%' }}
                          transition={{ delay: 0.2 + idx * 0.05, duration: 0.6, ease: 'easeOut' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal-elevated px-2 py-1 rounded text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {w.direction}
                          </div>
                        </motion.div>
                        <span className="text-xs text-muted-foreground text-center">Week {w.week}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* No personalized insights, only backend data allowed */}

        <motion.div
          className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <p className="text-sm text-muted-foreground">
            🔒 {t('encryptedDevice')}
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Insights;
