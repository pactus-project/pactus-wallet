'use client'

import React, { lazy, Suspense } from 'react'
import { motion } from "framer-motion";
const LazySpline = lazy(() => import("@splinetool/react-spline"));

const ThreeDMotion = () => {

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
                    />
                </motion.div>
            </Suspense>
        </div>
    )
}

export default ThreeDMotion