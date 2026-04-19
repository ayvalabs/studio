"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ISOMETRIC_EXERCISES } from '@/lib/workout-data';
import { Play, Settings2, Trophy, Flame } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-4xl mx-auto space-y-8">
      <header className="w-full text-center space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-2">
          <Flame size={14} />
          Challenge Active
        </div>
        <h1 className="text-5xl md:text-7xl font-headline tracking-tighter text-white">
          ISOMETRIC <span className="text-primary">21</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Transform your body in 21 days with 7 powerful isometric holds. 
          Scientific strength, professional results.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="space-y-6">
          <Card className="bg-card/50 border-white/5 overflow-hidden group">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Trophy className="text-primary" />
                Next Session
              </CardTitle>
              <CardDescription>
                Ready to push your limits today?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Link href="/workout" className="w-full">
                  <Button className="w-full h-14 text-lg font-bold gap-2 bg-primary hover:bg-primary/80 text-primary-foreground">
                    <Play fill="currentColor" size={20} />
                    START WORKOUT
                  </Button>
                </Link>
                <Link href="/settings" className="w-full">
                  <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 gap-2">
                    <Settings2 size={18} />
                    Customize Intervals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <ProgressTracker />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground pl-1">
            The 7 Holds
          </h2>
          <div className="grid gap-3">
            {ISOMETRIC_EXERCISES.map((ex) => (
              <Card key={ex.id} className="bg-card/30 border-white/5 hover:border-primary/20 transition-all cursor-default">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    {ex.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{ex.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{ex.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <footer className="pt-12 pb-8 text-center text-muted-foreground text-sm">
        <p>&copy; 2024 Isometric 21. Your challenge, your body.</p>
      </footer>
    </div>
  );
}