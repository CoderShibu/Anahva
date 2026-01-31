import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { TrendingUp, Moon, Activity, Heart, Sparkles, LineChart, Loader2 } from 'lucide-react';
import { journalAPI } from '@/lib/api';

const Insights = () => {
  const { t } = useLanguage();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [consistency, setConsistency] = useState({ streak: 0, weeklyCount: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const res = await journalAPI.list(30);
      if (res.success && res.journals) {
        // Prepare Data
        const decryptedJournals = res.journals.map((j: any) => {
          try {
            const payloadStr = atob(j.encrypted_payload);
            const payload = JSON.parse(payloadStr);
            return {
              date: new Date(payload.timestamp).toISOString().split('T')[0],
              timestamp: new Date(payload.timestamp),
              content: payload.content
            };
          } catch (e) { return null; }
        }).filter((j: any) => j !== null).sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime());

        // Calculate Consistency
        calculateConsistency(decryptedJournals);

        if (decryptedJournals.length > 0) {
          // Analyze via Gemini
          const analysisRes = await journalAPI.analyze(decryptedJournals);
          if (analysisRes.success) {
            // Map analysis to graph format
            const graphData = analysisRes.analysis.map((item: any) => {
              // Find matching journal for time
              const original = decryptedJournals.find((j: any) => j.date === item.date);
              const timeStr = original ? original.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';

              return {
                label: item.date.slice(5),
                score: item.score,
                fullDate: item.date,
                time: timeStr
              };
            });
            setHealthData(graphData);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load insights", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConsistency = (journals: any[]) => {
    if (journals.length === 0) return { streak: 0, weeklyCount: 0 };

    // Weekly Count
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyCount = journals.filter(j => j.timestamp > oneWeekAgo).length;

    // Streak
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const uniqueDates = Array.from(new Set(journals.map(j => j.date))).sort().reverse();

    // Check if posted today or yesterday to allow streak to continue
    // Logic: Iterate backwards from most recent date.
    let currentCheck = new Date();

    // Simple streak: unique consecutive days
    // If most recent is today or yesterday, streak is active.
    if (uniqueDates.length > 0) {
      const lastPost = new Date(uniqueDates[0]);
      const diffHours = (new Date().getTime() - lastPost.getTime()) / (1000 * 3600);
      if (diffHours < 48) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const curr = new Date(uniqueDates[i]);
          const prev = new Date(uniqueDates[i + 1]);
          const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 3600 * 24);
          if (diffDays <= 1.5 && diffDays >= 0.5) { // Roughly 1 day diff
            streak++;
          } else {
            break;
          }
        }
      }
    }

    setConsistency({ streak, weeklyCount });
  };

  const insights = [
    {
      icon: Moon,
      title: 'Evening Reflection',
      description: 'You tend to journal more in the evenings. This is when you feel most introspective.',
    },
    {
      icon: TrendingUp,
      title: 'Positive Trend',
      description: t('moodTrend'),
    },
  ];

  // SVG Graph Helper
  const renderGraph = () => {
    if (healthData.length < 2) return null;
    const height = 80; // Reduced from 150
    const maxScore = 100;

    // Points generation
    const points = healthData.map((d, i) => {
      const x = (i / (healthData.length - 1)) * 100;
      const y = 100 - (d.score / maxScore) * 100;
      return `${x},${y}`;
    }).join(' ');

    const formatTime = (dateObj: Date) => {
      if (!dateObj) return '';
      return dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateObj: Date) => {
      if (!dateObj) return '';
      return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
      <div className="relative h-[120px] w-full mt-4 mb-2 px-2">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 100 100`}>
          {/* Gradient Fill */}
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(30 45% 55%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(30 45% 55%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points} 100,100`} fill="url(#scoreGradient)" />
          {/* The Line */}
          <polyline
            points={points}
            fill="none"
            stroke="hsl(30 45% 55%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* Dots */}
          {healthData.map((d, i) => {
            const x = (i / (healthData.length - 1)) * 100;
            const y = 100 - (d.score / maxScore) * 100;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="2.5"
                fill="hsl(30 45% 55%)"
                className="hover:r-4 transition-all cursor-pointer"
              >
                <title>{d.score}% - {formatDate(new Date(d.fullDate))} {d.time ? d.time : ''}</title>
              </circle>
            );
          })}
        </svg>
        {/* Labels */}
        <div className="flex justify-between mt-2 w-full font-display text-xs text-muted-foreground tracking-wide">
          <div className="flex flex-col items-start">
            <span>{formatDate(new Date(healthData[0].fullDate))}</span>
            <span className="text-[10px] opacity-70">{healthData[0].time}</span>
          </div>
          <div className="flex flex-col items-end">
            <span>{formatDate(new Date(healthData[healthData.length - 1].fullDate))}</span>
            <span className="text-[10px] opacity-70">{healthData[healthData.length - 1].time}</span>
          </div>
        </div>
      </div>
    );
  };

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

        {/* 1. HEALTH IMPROVEMENT GRAPH (Replaces Weekly Mood) */}
        <motion.div
          className="card-3d p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl text-foreground">
              {t('healthImprovementGraph')}
            </h2>
          </div>

          {loading ? (
            <div className="h-40 flex items-center justify-center text-muted-foreground flex-col gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-display">Analyzing your journey...</span>
            </div>
          ) : healthData.length > 1 ? (
            renderGraph()
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-center p-4">
              <p className="font-display">Not enough data yet. Complete at least 2 journal entries to see your trend!</p>
            </div>
          )}
        </motion.div>

        {/* 2. CONSISTENCY MONITOR (New Section) */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-3d p-6 flex flex-col items-center justify-center text-center">
            <Activity className="w-8 h-8 text-primary mb-2" />
            <span className="text-4xl font-display font-medium text-foreground">{consistency.streak}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Day Streak</span>
          </div>
          <div className="card-3d p-6 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-8 h-8 text-primary mb-2" />
            <span className="text-4xl font-display font-medium text-foreground">{consistency.weeklyCount}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Entries This Week</span>
          </div>
        </motion.div>

        <motion.h2
          className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          Personalized Insights
        </motion.h2>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              className="card-3d p-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <insight.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
