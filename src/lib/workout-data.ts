export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscles: string[];
  cues: string[];
  suggestedSets: number;
}

export const ISOMETRIC_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Plank Hold',
    description: 'A foundational core exercise involving a straight body position held off the floor.',
    muscles: ['Abs', 'Obliques', 'Shoulders', 'Glutes'],
    cues: ['Keep hips in line with head and heels', 'Brace core tightly', 'Don\'t let lower back sag'],
    suggestedSets: 3,
  },
  {
    id: 2,
    name: 'Wall Sit',
    description: 'An isometric lower-body exercise where you hold a squat position against a wall.',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    cues: ['Thighs parallel to the floor', 'Back flat against the wall', 'Weight through your heels'],
    suggestedSets: 3,
  },
  {
    id: 3,
    name: 'Single-Leg Glute Bridge Hold',
    description: 'A posterior chain hold targeting glutes and stability.',
    muscles: ['Glutes', 'Hamstrings', 'Lower Back'],
    cues: ['Drive through grounded heel', 'Keep hips level', 'Squeeze glute at the top'],
    suggestedSets: 3,
  },
  {
    id: 4,
    name: 'Hollow Body Hold',
    description: 'A gymnastics-inspired core hold requiring significant abdominal strength.',
    muscles: ['Deep Core', 'Abs', 'Hip Flexors'],
    cues: ['Lower back pressed into floor', 'Legs and shoulders lifted', 'Create a banana shape'],
    suggestedSets: 3,
  },
  {
    id: 5,
    name: 'L-Sit Hold',
    description: 'An advanced hold supporting the body with arms while legs are extended in front.',
    muscles: ['Abs', 'Hip Flexors', 'Shoulders', 'Lats'],
    cues: ['Lock elbows out', 'Shoulders away from ears', 'Legs as straight as possible'],
    suggestedSets: 3,
  },
  {
    id: 6,
    name: 'Pike Push-Up Hold',
    description: 'A vertical pushing hold that targets the shoulders.',
    muscles: ['Deltoids', 'Triceps', 'Upper Back'],
    cues: ['Hips high in air', 'Head between arms', 'Control the depth'],
    suggestedSets: 3,
  },
  {
    id: 7,
    name: 'Bear Crawl Hover Hold',
    description: 'A full-body stability hold on hands and toes with knees hovering.',
    muscles: ['Core', 'Shoulders', 'Quads'],
    cues: ['Knees 2 inches off floor', 'Back flat like a table', 'Keep neck neutral'],
    suggestedSets: 3,
  },
];