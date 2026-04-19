"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Save } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [config, setConfig] = useState({
    holdTime: 30,
    repRest: 10,
    setRest: 20
  });

  useEffect(() => {
    const saved = localStorage.getItem('isometric-21-settings');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('isometric-21-settings', JSON.stringify(config));
    router.push('/');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-2xl mx-auto space-y-8">
      <header className="w-full flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground">
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl font-headline text-white">Workout Settings</h1>
      </header>

      <Card className="w-full bg-card/50 border-white/5">
        <CardHeader>
          <CardTitle>Intervals</CardTitle>
          <CardDescription>Configure the intensity of your isometric challenge.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label className="text-lg text-primary font-bold">Exercise Hold Time (Seconds)</Label>
            <RadioGroup 
              value={config.holdTime.toString()} 
              onValueChange={(val) => setConfig({...config, holdTime: parseInt(val)})}
              className="grid grid-cols-3 gap-4"
            >
              {[30, 45, 60].map((t) => (
                <Label
                  key={t}
                  className={`flex items-center justify-center h-12 rounded-md border-2 cursor-pointer transition-all ${config.holdTime === t ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 hover:border-white/20'}`}
                >
                  <RadioGroupItem value={t.toString()} className="sr-only" />
                  {t}s
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-lg text-primary font-bold">Rest Between Reps (Seconds)</Label>
            <RadioGroup 
              value={config.repRest.toString()} 
              onValueChange={(val) => setConfig({...config, repRest: parseInt(val)})}
              className="grid grid-cols-3 gap-4"
            >
              {[10, 20, 30].map((t) => (
                <Label
                  key={t}
                  className={`flex items-center justify-center h-12 rounded-md border-2 cursor-pointer transition-all ${config.repRest === t ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 hover:border-white/20'}`}
                >
                  <RadioGroupItem value={t.toString()} className="sr-only" />
                  {t}s
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-lg text-primary font-bold">Rest Between Exercises (Seconds)</Label>
            <RadioGroup 
              value={config.setRest.toString()} 
              onValueChange={(val) => setConfig({...config, setRest: parseInt(val)})}
              className="grid grid-cols-3 gap-4"
            >
              {[20, 30, 40].map((t) => (
                <Label
                  key={t}
                  className={`flex items-center justify-center h-12 rounded-md border-2 cursor-pointer transition-all ${config.setRest === t ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 hover:border-white/20'}`}
                >
                  <RadioGroupItem value={t.toString()} className="sr-only" />
                  {t}s
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Button onClick={handleSave} className="w-full h-14 text-lg font-bold gap-2 bg-accent hover:bg-accent/80 text-accent-foreground mt-4">
            <Save size={20} />
            SAVE CONFIGURATION
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}