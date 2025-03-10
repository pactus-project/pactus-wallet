'use client'

import React, { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from "framer-motion";
const LazySpline = lazy(() => import("@splinetool/react-spline"));

const ThreeDMotion = () => {
    const [showSpline, setShowSpline] = useState(false);



    useEffect(() => {
        // Don't show on mobile

        const timer = setTimeout(() => {
            setShowSpline(true);
        }, 1000);

        return () => clearTimeout(timer);

    }, []);

    return (
        <div style={{ width: '400px', height: '400px', overflow: 'hidden', position: 'relative' }} >


            <Suspense>
                {showSpline && (
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
                )}
            </Suspense>
        </div>
    )
}

export default ThreeDMotion