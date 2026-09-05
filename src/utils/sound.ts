// Web Audio API Retro/Futuristic Sound Generator

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(
  type: 'click' | 'buttonClick' | 'levelUp' | 'reward' | 'achievement' | 'bossDefeated' | 'failure' | 'heal' | 'systemUnlock',
  soundEnabled: boolean
) {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'systemUnlock': {
        // Quiet, gentle tactical activation tone & soft scanner hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.65);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      }
      case 'buttonClick':
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'heal': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }

      case 'reward': {
        // Two quick high chime notes
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.setValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }

      case 'levelUp': {
        // Ascending major chord fanfare
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.12, now + i * 0.06 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.3);
        });
        break;
      }

      case 'achievement': {
        // Epic sweeping bell sound
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const subGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.6); // G6

        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(130.81, now); // C3
        subOsc.frequency.exponentialRampToValueAtTime(261.63, now + 0.4); // C4

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        subGain.gain.setValueAtTime(0.08, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
        subOsc.start(now);
        subOsc.stop(now + 0.45);
        break;
      }

      case 'bossDefeated': {
        // Intense cinematic success arpeggio and heavy thunder sweep
        const oscSweep = ctx.createOscillator();
        const sweepGain = ctx.createGain();
        oscSweep.type = 'sawtooth';
        oscSweep.frequency.setValueAtTime(800, now);
        oscSweep.frequency.exponentialRampToValueAtTime(80, now + 0.8);

        sweepGain.gain.setValueAtTime(0.1, now);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        oscSweep.connect(sweepGain);
        sweepGain.connect(ctx.destination);
        oscSweep.start(now);
        oscSweep.stop(now + 0.9);

        // Major resolution fanfare
        const chords = [196.00, 293.66, 392.00, 493.88, 587.33, 783.99]; // G3, D4, G4, B4, D5, G5
        chords.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + 0.3 + idx * 0.05);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.05, now + 0.3 + idx * 0.05 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + idx * 0.05 + 0.5);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + 0.3 + idx * 0.05);
          osc.stop(now + 0.3 + idx * 0.05 + 0.6);
        });
        break;
      }

      case 'failure': {
        // Sad sliding down sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.5);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
        break;
      }
    }
  } catch (err) {
    console.error('Audio playback failed', err);
  }
}
