'use client';
import React, { useRef, useEffect, useState } from 'react';

const distance = (x1:number, y1:number, x2:number, y2: number) => {
    let res = (x1 - x2)*(x1 - x2) +  (y1 - y2)*(y1 - y2)
    return Math.sqrt(res)
}
export default function Geometry() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    const dots: { x: number, y: number, vx: number, vy: number }[] = [];
    const numDots = 25;
    const maxDistance = 250;
    const mouseRadius = 50;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            return
        }
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Create random dots
        for (let i = 0; i < numDots; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.1,
                vy: (Math.random() - 0.5) * 1.1
            });
        }

        const drawDots = () => {
            if (ctx === null) {
                return
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < numDots; i++) {
                const dot = dots[i];
                // if (mousePosition && mousePosition.x && mousePosition.y) {
                //     if(mouseRadius < distance(dot.x, dot.y, mousePosition.x, mousePosition.y)) {
                //         dot.x += 1
                //         dot.y += 1
                //     }
                // }
                // Update dot position
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Bounce off walls
                if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
                if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.fill();
            }
        };

        // Update mouse position
        

        const drawLines = () => {
            for (let i = 0; i < numDots; i++) {
                for (let j = i + 1; j < numDots; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance && ctx !== null) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1.1 - distance / maxDistance})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            drawDots();
            drawLines();
            requestAnimationFrame(animate);
        };
        animate();
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: any) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);


        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    },[mousePosition])

    return <canvas ref={canvasRef} className="absolute top-0 right-0 w-full z-[1]" />;
}
