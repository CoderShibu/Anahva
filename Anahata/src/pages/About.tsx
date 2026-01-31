import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import AnahraLogo from '@/components/AnahraLogo';
import { Heart, Shield, Lock, Mail, Sparkles, Users, Brain, Eye } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AnahraLogo size={48} />
            <h1 className="text-4xl md:text-5xl font-display text-primary">About Anahra</h1>
          </div>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <section className="card-3d p-8">
            <div className="flex items-start gap-4 mb-6">
              <Heart className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display text-foreground mb-4">About Anahra</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Anahra is India's privacy-first, emotionally aware AI journal and mental wellness companion.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  Built for the realities of life in India—academic pressure, career uncertainty, family expectations, and silent emotional stress—Anahra provides a calm, judgment-free space to reflect, write, and talk things through.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  Inspired by the Anahata (the heart center), the app is designed to support emotional clarity, balance, and self-understanding. Through guided journaling, voice reflections, and an empathetic AI companion, Anahra helps users slow down and listen to themselves without labels, diagnoses, or pressure.
                </p>
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mt-6">
                  <p className="text-foreground font-medium mb-2">Important to Remember:</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground">
                    <li>Anahra does not replace therapy.</li>
                    <li>It does not diagnose mental health conditions.</li>
                    <li>It exists to make emotional reflection accessible, private, and culturally relevant.</li>
                  </ul>
                </div>
                <p className="text-foreground leading-relaxed mt-6 font-medium">
                  Privacy is not a feature here—it is the foundation. Your thoughts stay yours.
                </p>
              </div>
            </div>
          </section>

          <section className="card-3d p-8">
            <div className="flex items-start gap-4 mb-6">
              <Sparkles className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display text-foreground mb-4">Why Anahra Matters</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-foreground font-medium mb-2">Designed for India's emotional and cultural context</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-foreground font-medium mb-2">Privacy-first and stigma-free by default</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-foreground font-medium mb-2">Emotionally aware AI that listens before responding</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-foreground font-medium mb-2">Journaling that reduces overwhelm instead of creating it</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl md:col-span-2">
                    <p className="text-foreground font-medium mb-2">Calm, accessible experience across phones and laptops</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-foreground text-lg font-display italic text-center">
                    Anahra is not about fixing people.<br />
                    It's about giving people a safe place to understand themselves.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card-3d p-8">
            <div className="flex items-start gap-4 mb-6">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display text-foreground mb-4">About the Builder</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Hi, I'm <span className="font-semibold text-primary">Shibasish</span>, the creator of Anahra.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  I built Anahra with a clear intention: to create India's most respectful and private AI-powered mental wellness journal.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  As a student and developer, I saw how many mental health tools felt either too clinical or disconnected from real life in India. Anahra is my effort to bridge that gap—combining thoughtful technology with empathy, responsibility, and trust.
                </p>
                <p className="text-foreground leading-relaxed">
                  Every feature is built with care, restraint, and long-term well-being in mind.
                </p>
              </div>
            </div>
          </section>

          <section className="card-3d p-8">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display text-foreground mb-4">Get in Touch</h2>
                <p className="text-foreground leading-relaxed mb-4">
                  If you have feedback, ideas, or concerns—or simply want to share your thoughts—you can reach out directly.
                </p>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <p className="text-foreground font-medium mb-2">Email:</p>
                  <a 
                    href="mailto:shibasish2005@gmail.com" 
                    className="text-primary hover:text-primary/80 transition-colors text-lg"
                  >
                    shibasish2005@gmail.com
                  </a>
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  Every message is read personally.
                </p>
              </div>
            </div>
          </section>

          <section className="card-3d p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display text-foreground mb-4">🌱 A Note on Trust</h2>
                <p className="text-foreground leading-relaxed">
                  Anahra is built to grow responsibly, with transparency and care.<br />
                  Your trust matters—and we work to earn it every day.
                </p>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default About;

