import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    const dotSpringX = useSpring(cursorX, { damping: 20, stiffness: 800 });
    const dotSpringY = useSpring(cursorY, { damping: 20, stiffness: 800 });

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.closest('button') ||
                target.closest('a') ||
                target.closest('input') ||
                target.closest('textarea') ||
                target.closest('[role="button"]');

            setIsHovering(!!isInteractive);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY, isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Outer Ring */}
            <motion.div
                className="absolute w-8 h-8 border border-primary/50 rounded-full"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? 'rgba(var(--primary), 0.1)' : 'transparent',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            />

            {/* Inner Dot */}
            <motion.div
                className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                style={{
                    x: dotSpringX,
                    y: dotSpringY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isHovering ? 0.5 : 1,
                }}
            />

            {/* Trailing Glow */}
            <motion.div
                className="absolute w-20 h-20 bg-primary/20 blur-3xl rounded-full"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: 0.3,
                }}
            />
        </div>
    );
}
