import React from 'react';
import { motion } from 'framer-motion';
import { PopCard, containerVariants } from '../ui/PopCard';
import { BrainCircuit } from 'lucide-react';

const AIAssistant = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <PopCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(to bottom right, var(--bg-card), #f0f9ff)' }}>
      <BrainCircuit size={80} color="#0284c7" style={{ marginBottom: '2rem' }} />
      <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>Teacher AI Intelligence</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '0 auto 3rem', maxWidth: '600px', lineHeight: '1.6' }}>Connect to standard OpenAI models to generate lesson plans, rubrics, create assignments, and audit documents automatically.</p>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn primary-btn" style={{ padding: '1rem 3rem', fontSize: '1.1rem', background: '#0284c7', borderRadius: '30px' }}>Start Generating</motion.button>
    </PopCard>
  </motion.div>
);
export default AIAssistant;