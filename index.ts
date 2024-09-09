import { Keyboard } from './keyboard';
import { ChordType} from './types';
import { Phrase, ChordProgression, ChordPlayStyle, RhythmPattern, Tempo, TimeSignature, Score, NoteEvent } from './structures';

const keyboard = new Keyboard();

// Helper functions
const createChordProgression = (chords: { root: string; type: ChordType; duration: number; baseVolume: number }[], style: ChordPlayStyle, rhythm: RhythmPattern): ChordProgression =>
  new ChordProgression(chords, style, rhythm);

const createMelody = (notes: string[], durations: number[], baseVolume: number): NoteEvent[] =>
  notes.map((note, index) => new NoteEvent(note, durations[index] * 1000, baseVolume, false));

const createScore = (title: string, tempo: number, timeSignature: [number, number]): Score =>
  new Score(title, "AI Composer", new Tempo(tempo), new TimeSignature(...timeSignature), []);

// Test definitions
const tests = {
  "Simple Chord Progressions": [
    async () => {
      const jazzProgression = createChordProgression([
        { root: 'C4', type: ChordType.MajorSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'A4', type: ChordType.MinorSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'D4', type: ChordType.MinorSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 }
      ], ChordPlayStyle.Broken, RhythmPattern.ragtime());
      await keyboard.playPhrase(new Phrase([jazzProgression]));
    },
    async () => {
      const bluesProgression = createChordProgression([
        { root: 'C4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'F4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'C4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'F4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 },
        { root: 'C4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 }
      ], ChordPlayStyle.Rag, RhythmPattern.waltz());
      await keyboard.playPhrase(new Phrase([bluesProgression]));
    }
  ],

  "Complex Compositions": [
    async () => {
      const score = createScore("Short Composition", 120, [4, 4]);
      const intro = createChordProgression([
        { root: 'C4', type: ChordType.Major, duration: 2, baseVolume: 0.7 },
        { root: 'G4', type: ChordType.Major, duration: 2, baseVolume: 0.7 }
      ], ChordPlayStyle.Arpeggio, RhythmPattern.fourFourCommon());
      const verse = createChordProgression([
        { root: 'C4', type: ChordType.Major, duration: 1, baseVolume: 0.8 },
        { root: 'A4', type: ChordType.Minor, duration: 1, baseVolume: 0.8 },
        { root: 'F4', type: ChordType.Major, duration: 1, baseVolume: 0.8 },
        { root: 'G4', type: ChordType.DominantSeventh, duration: 1, baseVolume: 0.8 }
      ], ChordPlayStyle.Broken, RhythmPattern.ragtime());
      score.addPhrase(new Phrase([intro, verse]));
      await keyboard.playScore(score);
    },
    async () => {
      const score = createScore("Complex Melodic Composition", 180, [4, 4]);
      const motif = createMelody(['E4', 'D4', 'C4', 'D4'], [0.25, 0.25, 0.25, 0.25], 0.8);
      const introChords = createChordProgression([
        { root: 'C4', type: ChordType.Major, duration: 1, baseVolume: 0.7 },
        { root: 'G4', type: ChordType.Major, duration: 1, baseVolume: 0.7 }
      ], ChordPlayStyle.Arpeggio, RhythmPattern.fourFourCommon());
      const introMelody = createMelody(['G4', 'E4', 'G4', 'C5'], [0.5, 0.5, 0.5, 0.5], 0.9);
      const introPhrase = new Phrase([introChords, introMelody]);
      score.addPhrase(introPhrase);
      // Add more phrases as needed...
      await keyboard.playScore(score);
    }
  ],

  "Roman Numeral Progressions": [
    async () => {
      const jazzProgression = ChordProgression.fromRomanNumerals(
        'C', ['ii7', 'V7', 'I6', 'vi7', 'ii9', 'V13', 'IMaj7'],
        ChordPlayStyle.Arpeggio, RhythmPattern.jazzSwing()
      );
      await keyboard.playPhrase(new Phrase([jazzProgression]));
    },
    async () => {
      const bluesProgression = ChordProgression.fromRomanNumerals(
        'F', ['I7', 'IV7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
        ChordPlayStyle.Broken, RhythmPattern.shuffle()
      );
      await keyboard.playPhrase(new Phrase([bluesProgression]));
    }
  ]
};

// Test runner
async function runTests() {
  console.log("\x1b[1m\x1b[34mRunning Musical Keyboard Test Suite\x1b[0m");
  for (const [category, categoryTests] of Object.entries(tests)) {
    console.log(`\n\x1b[1m\x1b[33mCategory: ${category}\x1b[0m`);
    for (let i = 0; i < categoryTests.length; i++) {
      console.log(`\x1b[36m  Running test ${i + 1}...\x1b[0m`);
      await categoryTests[i]();
      console.log(`\x1b[32m  Test ${i + 1} completed.\x1b[0m`);
    }
  }
  console.log("\n\x1b[1m\x1b[32mAll tests completed successfully!\x1b[0m");
}

// Main function
async function main() {
  await runTests();
}

main().catch(console.error);