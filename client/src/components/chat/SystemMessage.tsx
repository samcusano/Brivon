import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  'Assessing query',
  'Planning for analysis',
  'Searching file sources for relevant information',
  'Researching details',
  'Evaluating details',
];

export function SystemMessage({ isCollapsed }: { isCollapsed: boolean }) {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    if (isCollapsed) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isCollapsed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex w-full max-w-4xl mx-auto mb-8 gap-6 p-4"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm bg-primary/20 text-primary-foreground">
        <motion.div animate={{ rotate: isCollapsed ? 0 : 360 }} transition={{ duration: 2, repeat: isCollapsed ? 0 : Infinity }}>
          ✨
        </motion.div>
      </div>

      <div className="flex-1">
        <div className="font-heading font-semibold text-lg mb-4">Zania is working…</div>

        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div className="space-y-2" layout>
              {STEPS.map((step, idx) => {
                const isCompleted = idx < activeStep;
                const isActive = idx === activeStep;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </motion.div>
                    ) : (
                      <div className="flex-shrink-0">
                        {isActive ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                            <Circle className="w-4 h-4 text-primary" />
                          </motion.div>
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/30" />
                        )}
                      </div>
                    )}
                    <span
                      className={`text-sm transition-colors ${
                        isCompleted
                          ? 'text-muted-foreground/60 line-through'
                          : isActive
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground/60'
                      }`}
                    >
                      {step}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              Analysis complete
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
