"use client";
import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Card, CardContent, Typography, Box } from "@mui/material";


interface WinnerCardProps {
  winnerName: string;
  color1: string;
  enableConfetti?: boolean;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winnerName, color1, enableConfetti = true }) => {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!enableConfetti) return;
    if (hasFired.current) return;
    hasFired.current = true;
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = [color1];

    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  }, [enableConfetti, color1]);

  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Card sx={{ bgcolor: 'success.main', color: 'success.contrastText', borderColor: 'success.dark', position: 'relative', zIndex: 1 }}>
        <CardContent>
          <Typography align="center" variant="h6" fontWeight={700}>
            🏆 Gagnant : {winnerName}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WinnerCard;
