'use client'
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react'
import { motion } from "framer-motion";
const LazySpline = lazy(() => import("@splinetool/react-spline"));

const ThreeDMotion = () => {
    const [showSpline, setShowSpline] = useState(false);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleResize = () => {
        // Clear any existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        // Set a new timeout
        debounceTimeoutRef.current = setTimeout(() => {
            // Check if the screen width is larger than 768px (not mobile)
            setShowSpline(window.innerWidth > 768);
        }, 200); // 200ms debounce time
    };

    useEffect(() => {
        // Initial check (no need to debounce this one)
        setShowSpline(window.innerWidth > 768);

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup listener and any pending timeouts on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);
    
    if (!showSpline) {
        return <></>
    }
    return (
        <div style={{ width: '400px', height: '400px', overflow: 'hidden', position: 'relative' }} >
            <Suspense>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    style={{ width: '600px', height: '600px', position: 'absolute' }}
                >
                    <LazySpline
                        scene="https://prod.spline.design/mZBrYNcnoESGlTUG/scene.splinecode"
                        className="absolute inset-0 w-full h-full origin-top-left flex items-center justify-center"
                    />
                </motion.div>
            </Suspense>
        </div>
    )
}

export default ThreeDMotion