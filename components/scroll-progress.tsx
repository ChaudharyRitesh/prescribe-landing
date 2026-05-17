'use client';

import { useScroll, useSpring, motion } from 'framer-motion';
import Box from '@mui/material/Box';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <Box
      component={motion.div}
      style={{ scaleX }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: '#14B8A6',
        transformOrigin: '0%',
        zIndex: 9999,
      }}
    />
  );
}
