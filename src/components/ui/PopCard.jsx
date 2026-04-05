import React from 'react';
import { motion } from 'framer-motion';

export const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
export const cardVariants = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } } };
export const hover3D = { y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.18)", borderColor: "var(--accent)" };

export const PopCard = ({ children, style, onClick, ...props }) => (
  <motion.div variants={cardVariants} whileHover={onClick ? hover3D : undefined} onClick={onClick} className="card-3d" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', height: 'auto', minHeight: 'fit-content', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default', ...style }} {...props}>
    {children}
  </motion.div>
);