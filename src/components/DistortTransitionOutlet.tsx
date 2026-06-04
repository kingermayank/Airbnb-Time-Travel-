import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';

export function DistortTransitionOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.key}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', minHeight: '100%' }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
