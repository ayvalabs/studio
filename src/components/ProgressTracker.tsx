"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProgressTracker() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('isometric-21-progress');
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, []);

  const totalDays = 21;
  const progressPercent = Math.round((completedDays.length / totalDays) * 100);

  return (
    <Card className="bg-card/50 border-white/5">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>21-Day Progress</span>
          <span className="text-accent font-headline">{progressPercent}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const isCompleted = completedDays.includes(dayNum);
            return (
              <div
                key={dayNum}
                className={cn(
                  "aspect-square rounded-md flex flex-col items-center justify-center border transition-all duration-300",
                  isCompleted 
                    ? "bg-accent/20 border-accent text-accent" 
                    : "bg-muted/10 border-white/10 text-muted-foreground"
                )}
              >
                <span className="text-[10px] font-bold uppercase opacity-50 mb-0.5">D{dayNum}</span>
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={12} className="opacity-30" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}