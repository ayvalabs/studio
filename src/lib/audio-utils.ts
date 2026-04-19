class AudioController {
  private audioCtx: AudioContext | null = null;
  private musicNodes: (OscillatorNode | GainNode | BiquadFilterNode)[] = [];

  private initContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBeep(frequency: number = 440, duration: number = 0.1, type: OscillatorType = 'sine') {
    this.initContext();
    if (!this.audioCtx) return;

    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }

  playCountdown() {
    this.playBeep(880, 0.1, 'sine');
  }

  playFinish() {
    this.playBeep(1320, 0.3, 'sine');
    setTimeout(() => this.playBeep(1760, 0.5, 'sine'), 100);
  }

  startMotivationalMusic() {
    this.initContext();
    if (!this.audioCtx || this.musicNodes.length > 0) return;

    const now = this.audioCtx.currentTime;

    // Deep Power Drone
    const drone = this.audioCtx.createOscillator();
    const droneGain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();
    
    drone.type = 'sawtooth';
    drone.frequency.setValueAtTime(55, now); // A1
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);
    filter.Q.setValueAtTime(5, now);

    droneGain.gain.setValueAtTime(0, now);
    droneGain.gain.linearRampToValueAtTime(0.08, now + 2);

    drone.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.audioCtx.destination);
    drone.start();

    // Rhythmic Focus Pulse (120 BPM)
    const pulse = this.audioCtx.createOscillator();
    const pulseGain = this.audioCtx.createGain();
    pulse.type = 'sine';
    pulse.frequency.setValueAtTime(110, now);

    // Automation for pulsing
    const pulseRate = 0.5; // 120 BPM
    for (let i = 0; i < 120; i++) {
      const time = now + i * pulseRate;
      pulseGain.gain.setValueAtTime(0, time);
      pulseGain.gain.linearRampToValueAtTime(0.12, time + 0.05);
      pulseGain.gain.linearRampToValueAtTime(0, time + 0.4);
    }

    pulse.connect(pulseGain);
    pulseGain.connect(this.audioCtx.destination);
    pulse.start();

    this.musicNodes.push(drone, droneGain, filter, pulse, pulseGain);
  }

  stopMotivationalMusic() {
    const fadeOut = 0.5;
    const now = this.audioCtx?.currentTime || 0;

    this.musicNodes.forEach(node => {
      if (node instanceof GainNode) {
        node.gain.exponentialRampToValueAtTime(0.001, now + fadeOut);
      }
    });

    setTimeout(() => {
      this.musicNodes.forEach(node => {
        if (node instanceof OscillatorNode) {
          node.stop();
        }
        node.disconnect();
      });
      this.musicNodes = [];
    }, fadeOut * 1000);
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const audioController = typeof window !== 'undefined' ? new AudioController() : null;
