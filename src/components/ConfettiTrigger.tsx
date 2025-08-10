import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiTriggerProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiTrigger({ trigger, onComplete }: ConfettiTriggerProps) {
  useEffect(() => {
    if (trigger) {
      // Create a burst of confetti
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const runAnimation = () => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          onComplete?.();
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
          colors: ['#14b8a6', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'],
        });

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
          colors: ['#14b8a6', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'],
        });

        requestAnimationFrame(runAnimation);
      };

      runAnimation();
    }
  }, [trigger, onComplete]);

  return null;
}