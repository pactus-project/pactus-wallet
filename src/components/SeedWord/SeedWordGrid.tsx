'use client';
import React from 'react';
import './style.css';

interface SeedWordGridProps {
  children: React.ReactNode;
  className?: string;
}

const SeedWordGrid: React.FC<SeedWordGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`seed-word-grid ${className}`}>
      {children}
    </div>
  );
};

export default SeedWordGrid;
