import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFoundPage.css';

/** Drifting particle / star */
function Particle({
  x,
  delay,
  size,
}: {
  x: string;
  delay: number;
  size: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: [0, 0.4, 0.4, 0], y: '-10vh' }}
      transition={{
        duration: 8 + Math.random() * 6,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        position: 'absolute',
        left: x,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'rgba(34, 34, 34, 0.15)',
      }}
    />
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="nf-container">
      {/* Background particles */}
      <div className="nf-bg-layer">
        {Array.from({ length: 15 }).map((_, i) => (
          <Particle
            key={i}
            x={`${5 + i * 6.5}%`}
            delay={i * 0.8}
            size={2 + Math.random() * 3}
          />
        ))}
      </div>

      {/* Content */}
      <div className="nf-content">
        {/* Melting clock illustration — hero piece */}
        <motion.div
          className="nf-illustration"
          initial={{ opacity: 0, y: -20, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.img
            src="/images/404.png"
            alt="A melting clock, lost in time"
            className="nf-clock-img"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        <motion.h1
          className="nf-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Lost in the Timeline
        </motion.h1>

        <motion.p
          className="nf-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          The temporal coordinates you entered don't match any known destination.
          You may have drifted into an uncharted timeline.
        </motion.p>

        <motion.div
          className="nf-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            className="nf-btn-primary"
            onClick={() => navigate('/')}
          >
            Return to the Present
          </button>
        </motion.div>

        <motion.div
          className="nf-disclaimer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          If you believe this is a temporal error, please contact Warpbnb
          support. Do not attempt to fix the timeline yourself.
        </motion.div>
      </div>
    </div>
  );
}
