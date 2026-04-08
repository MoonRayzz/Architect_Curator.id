"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimateInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    duration?: number;
}

export default function AnimateIn({
    children,
    delay = 0,
    direction = "up",
    duration = 0.6
}: AnimateInProps) {

    // Mengatur arah datangnya animasi
    const directionOffset = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directionOffset[direction]
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0
            }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98] // Custom cubic-bezier untuk efek smooth ala Apple
            }}
        >
            {children}
        </motion.div>
    );
}