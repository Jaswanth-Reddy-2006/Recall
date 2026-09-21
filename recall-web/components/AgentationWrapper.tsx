'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Agentation = dynamic(
  () => import('agentation').then((mod) => mod.Agentation),
  { ssr: false }
);

export default function AgentationWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render Agentation toolbar during local development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!mounted) return null;

  return <Agentation endpoint="http://localhost:4747" />;
}
