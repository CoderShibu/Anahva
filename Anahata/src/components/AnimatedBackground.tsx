
import React, { useEffect, useRef } from 'react';
import { useNightWatch } from '@/contexts/NightWatchContext';
import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';

const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { isNightWatch } = useNightWatch();
    const { isConfidential } = useConfidentialMode();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const draw = () => {
            t += 0.002;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Gradient logic based on mode
            let color1, color2;

            if (isConfidential) {
                // Green/Matrix-like for confidential
                color1 = [20, 40, 20];
                color2 = [30, 60, 30];
            } else if (isNightWatch) {
                // Deep Blue/Black for night
                color1 = [10, 10, 25];
                color2 = [20, 20, 40];
            } else {
                // Warm/Gold for standard
                color1 = [255, 250, 240];
                color2 = [255, 230, 200];
            }

            // Simple animated gradient placeholder
            // For performance and aesthetics, we use CSS mostly, but this canvas allows particles if needed.
            // Actually, let's just make it a simple CSS-driven component to be safe and robust.
        };

        // Instead of complex canvas which might fail again, let's return a simple div with CSS keyframes
        // The previous implementation was likely CSS or Canvas.
    }, [isNightWatch, isConfidential]);

    return (
        <div className="fixed inset-0 -z-50 transition-colors duration-1000 ease-in-out overflow-hidden pointer-events-none">
            {/* Background Layer */}
            <div className={`absolute inset-0 opacity-40 ${isConfidential ? 'bg-green-950' :
                    isNightWatch ? 'bg-slate-950' :
                        'bg-amber-50/50'
                }`} />

            {/* Floating Orbs (CSS Animation) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold/10 blur-[100px] animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[100px] animate-blob animation-delay-4000" />
        </div>
    );
};

export default AnimatedBackground;
