import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, MapPin, MessageSquare, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
  title: string;
  description: string;
  icon: any;
  color: string;
}

const steps: Step[] = [
  {
    title: "Welcome to EduTrack",
    description: "Your all-in-one platform for modern education management. Let's get you set up.",
    icon: GraduationCap,
    color: "bg-[#00C9A7]"
  },
  {
    title: "Track Everything",
    description: "From daily attendance to homework and assessments, keep everything in sync in real-time.",
    icon: MapPin,
    color: "bg-blue-500"
  },
  {
    title: "Communicate Easily",
    description: "Join class channels and stay connected with teachers, parents, and students.",
    icon: MessageSquare,
    color: "bg-purple-500"
  }
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1B2A]/90 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-[#1B263B] rounded-[2.5rem] border border-[#00C9A7]/10 p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  currentStep === i ? "w-8 bg-[#00C9A7]" : "w-3 bg-white/10"
                )}
              />
            ))}
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className={cn("w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-[#0D1B2A] shadow-lg", step.color)}>
              <step.icon className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-bold font-display tracking-tight">{step.title}</h2>
            <p className="text-[#F5F7FA]/60 leading-relaxed font-medium">
              {step.description}
            </p>
          </motion.div>
        </div>

        <button
          onClick={next}
          className="w-full bg-[#00C9A7] text-[#0D1B2A] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#00C9A7]/20"
        >
          <span>{currentStep === steps.length - 1 ? "Get Started" : "Next Step"}</span>
          {currentStep === steps.length - 1 ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </motion.div>
    </div>
  );
}
