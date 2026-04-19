"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ISOMETRIC_EXERCISES, Exercise } from '@/lib/workout-data';
import { generateWorkoutImage } from '@/ai/flows/ai-generated-workout-image-display';
import { audioController } from '@/lib/audio-utils';
import { ArrowLeft, Pause, Play, SkipForward, X, RotateCcw, Camera, Scan, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

type WorkoutPhase = 'READY' | 'HOLD' | 'REP_REST' | 'SET_REST' | 'FINISHED';

export default function WorkoutPage() {
  const router = useRouter();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<WorkoutPhase>('READY');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [exerciseImages, setExerciseImages] = useState<Record<string, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [accuracy, setAccuracy] = useState(0);

  const [settings, setSettings] = useState({
    holdTime: 30,
    repRest: 10,
    setRest: 20
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentEx = ISOMETRIC_EXERCISES[exerciseIndex];

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem('isometric-21-settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Camera Access
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use the form analysis feature.',
        });
      }
    };
    getCameraPermission();
  }, []);

  // Mock Pose Analysis Accuracy
  useEffect(() => {
    if (isActive && phase === 'HOLD') {
      const interval = setInterval(() => {
        // Simulating a "live" fluctuation in pose accuracy
        setAccuracy(Math.floor(Math.random() * (98 - 85 + 1) + 85));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setAccuracy(0);
    }
  }, [isActive, phase]);

  // Fetch AI Image for current exercise
  useEffect(() => {
    const fetchImage = async () => {
      if (exerciseImages[currentEx.name]) return;
      
      setIsGeneratingImage(true);
      try {
        const result = await generateWorkoutImage({ exerciseName: currentEx.name });
        setExerciseImages(prev => ({ ...prev, [currentEx.name]: result.imageUrl }));
      } catch (error) {
        console.error("Failed to generate exercise image", error);
      } finally {
        setIsGeneratingImage(false);
      }
    };
    fetchImage();
  }, [currentEx.name, exerciseImages]);

  // Audio countdowns
  useEffect(() => {
    if (isActive && timeLeft <= 3 && timeLeft > 0) {
      audioController?.playCountdown();
    }
    if (isActive && timeLeft === 0) {
      audioController?.playFinish();
    }
  }, [timeLeft, isActive]);

  const nextPhase = useCallback(() => {
    if (phase === 'READY') {
      setPhase('HOLD');
      setTimeLeft(settings.holdTime);
      audioController?.speak(`Hold the ${currentEx.name}`);
    } else if (phase === 'HOLD') {
      if (currentSet < currentEx.suggestedSets) {
        setPhase('REP_REST');
        setTimeLeft(settings.repRest);
        audioController?.speak('Rest');
      } else if (exerciseIndex < ISOMETRIC_EXERCISES.length - 1) {
        setPhase('SET_REST');
        setTimeLeft(settings.setRest);
        audioController?.speak('Take a break');
      } else {
        setPhase('FINISHED');
        setIsActive(false);
        // Save progress
        const saved = localStorage.getItem('isometric-21-progress');
        const progress = saved ? JSON.parse(saved) : [];
        const today = new Date().getDate(); 
        if (!progress.includes(today)) {
          progress.push(today);
          localStorage.setItem('isometric-21-progress', JSON.stringify(progress));
        }
      }
    } else if (phase === 'REP_REST') {
      setCurrentSet(prev => prev + 1);
      setPhase('HOLD');
      setTimeLeft(settings.holdTime);
      audioController?.speak('Hold again');
    } else if (phase === 'SET_REST') {
      setExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setPhase('READY');
      setTimeLeft(10);
    }
  }, [phase, currentSet, exerciseIndex, currentEx, settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      nextPhase();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, nextPhase]);

  const togglePause = () => setIsActive(!isActive);

  const currentImageUrl = exerciseImages[currentEx.name] || `https://picsum.photos/seed/${currentEx.id}/800/600`;

  const totalSteps = ISOMETRIC_EXERCISES.length;
  const currentProgress = ((exerciseIndex + (currentSet-1)/currentEx.suggestedSets) / totalSteps) * 100;

  if (phase === 'FINISHED') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center mx-auto text-accent">
            <Trophy size={48} />
          </div>
          <h1 className="text-4xl font-headline text-white">CHALLENGE COMPLETE!</h1>
          <p className="text-muted-foreground">Amazing job! You finished all 7 isometric holds today. You are mastering your form.</p>
          <Button onClick={() => router.push('/')} className="w-full bg-primary text-primary-foreground h-14 font-bold">
            RETURN TO DASHBOARD
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-card/30">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-muted-foreground">
          <X />
        </Button>
        <div className="flex-1 px-8">
          <Progress value={currentProgress} className="h-2" />
        </div>
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Exercise {exerciseIndex + 1}/7
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-6 max-w-7xl mx-auto w-full">
        {/* Visual Panels Container */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reference Image */}
            <Card className="overflow-hidden bg-card/50 border-white/5 aspect-video relative group">
              {isGeneratingImage && !exerciseImages[currentEx.name] ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 text-white gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-bold tracking-widest text-sm">LOADING PRO FORM...</p>
                </div>
              ) : null}
              <Image 
                src={currentImageUrl}
                alt={currentEx.name}
                fill
                className="object-cover"
                data-ai-hint={currentEx.name}
              />
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-[10px] font-bold text-white uppercase tracking-tighter">
                Pro Model Reference
              </div>
            </Card>

            {/* User Camera */}
            <Card className="overflow-hidden bg-card/50 border-white/5 aspect-video relative">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover scale-x-[-1]" 
                autoPlay 
                muted 
                playsInline
              />
              
              {/* Scan Overlay UI */}
              <div className="absolute inset-0 border-2 border-primary/20 pointer-events-none">
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  <div className="bg-black/60 px-3 py-1 rounded-full flex items-center gap-2 border border-primary/30">
                    <Activity size={14} className={isActive && phase === 'HOLD' ? "text-primary animate-pulse" : "text-muted-foreground"} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Analysis</span>
                  </div>
                  {accuracy > 0 && (
                    <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-sm font-bold flex items-center gap-2">
                      <Scan size={14} />
                      {accuracy}% MATCH
                    </div>
                  )}
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-primary" />
                <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-primary" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-primary" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-primary" />
              </div>

              {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 text-center">
                  <Alert variant="destructive" className="max-w-xs bg-destructive/10">
                    <AlertTitle className="flex items-center justify-center gap-2">
                      <Camera size={16} /> Camera Access Required
                    </AlertTitle>
                    <AlertDescription>
                      Enable camera for real-time pose estimation and form matching.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-card/30 border-white/5">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold text-primary uppercase text-xs tracking-widest">Exercise: {currentEx.name}</h3>
                  <div className="flex gap-2">
                    {currentEx.muscles.map(m => (
                      <span key={m} className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold uppercase">
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">"{currentEx.description}"</p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-white/5">
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-primary uppercase text-xs tracking-widest">Live Form Cues</h3>
                  <div className="space-y-1">
                    {currentEx.cues.map((cue, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {cue}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <Card className="bg-card/50 border-white/5 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-4 left-6 text-xs font-bold text-accent uppercase tracking-widest">
              Set {currentSet} of {currentEx.suggestedSets}
            </div>
            
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="50%" cy="50%" r="48%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-white/5"
                />
                <circle
                  cx="50%" cy="50%" r="48%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * timeLeft / (phase === 'HOLD' ? settings.holdTime : 10))}
                  strokeLinecap="round"
                  className={`timer-ring transition-all duration-1000 ${phase === 'HOLD' ? 'text-primary' : 'text-accent'}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-6xl font-headline font-bold text-white tabular-nums">{timeLeft}</span>
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Seconds</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <h4 className="text-lg font-headline text-white mb-1">
                {phase === 'READY' && 'GET READY'}
                {phase === 'HOLD' && 'HOLD POSITION'}
                {phase === 'REP_REST' && 'BREATHE'}
                {phase === 'SET_REST' && 'NEXT EXERCISE'}
              </h4>
              <p className="text-muted-foreground text-xs">
                {phase === 'READY' && `Next: ${currentEx.name}`}
                {phase === 'HOLD' && 'Match the model\'s form!'}
                {phase === 'REP_REST' && 'Brief recovery...'}
                {phase === 'SET_REST' && 'Adjusting camera...'}
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={togglePause} 
              variant={isActive ? "secondary" : "default"}
              className={`h-14 text-sm font-bold gap-2 ${!isActive ? 'bg-primary hover:bg-primary/80 text-primary-foreground' : ''}`}
            >
              {isActive ? <Pause size={18} /> : <Play fill="currentColor" size={18} />}
              {isActive ? 'PAUSE' : 'START'}
            </Button>
            <Button 
              onClick={nextPhase} 
              variant="outline"
              className="h-14 border-white/10 hover:bg-white/5 gap-2 text-sm"
            >
              <SkipForward size={18} />
              SKIP
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 22V18" />
      <path d="M14 22V18" />
      <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
    </svg>
  );
}
