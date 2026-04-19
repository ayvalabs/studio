'use server';
/**
 * @fileOverview A Genkit flow that generates AI images for specific workout poses.
 *
 * - generateWorkoutImage - A function that generates an image for a given workout exercise.
 * - GenerateWorkoutImageInput - The input type for the generateWorkoutImage function.
 * - GenerateWorkoutImageOutput - The return type for the generateWorkoutImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const workoutImagePrompts = [
  {
    id: 1,
    exercise_name: 'Plank Hold',
    prompt:
      'Full-body side view of an attractive athletic Asian woman in a deep teal sports bra and charcoal gray high-waisted leggings performing a perfect forearm plank on a dark green mat in a modern gym studio with large windows and soft daylight. Her body forms a straight line from head to heels, elbows under shoulders, core tight, glutes engaged, gaze slightly down, expression focused yet calm. Background is consistent neutral, slightly blurred gym environment with rubber flooring and a few indistinct weights.',
  },
  {
    id: 2,
    exercise_name: 'Wall Sit',
    prompt:
      'Three-quarter side view of the same attractive athletic Asian woman in the same teal sports bra and charcoal leggings performing a wall sit against a light gray wall in the same modern gym studio. Her back is flat on the wall, hips and knees at 90 degrees as if sitting on an invisible chair, feet shoulder-width apart, arms relaxed crossed lightly over her chest, face showing composed determination. Background, lighting, and flooring match the previous plank image for consistency.',
  },
  {
    id: 3,
    exercise_name: 'Single-Leg Glute Bridge Hold',
    prompt:
      'Side view of the same athletic Asian woman on a dark green mat in the same gym, performing a single-leg glute bridge hold. One foot is planted firmly on the mat, the other leg extended straight out at hip height, hips lifted so her body forms a straight line from shoulders to knee. Arms rest on the floor by her sides for balance, core and glutes visibly engaged, expression focused but relaxed. Clothing, background, and lighting are identical to the other images.',
  },
  {
    id: 4,
    exercise_name: 'Hollow Body Hold',
    prompt:
      'Angled overhead view of the same attractive Asian woman in teal sports bra and charcoal leggings performing a hollow body hold on the same mat. She lies on her back with lower back pressed into the mat, shoulders and legs lifted off the floor creating a smooth banana shape, arms extended overhead near her ears, legs straight and together. Her face shows calm concentration, breathing controlled. The modern gym studio background, windows, and lighting remain consistent and slightly blurred.',
  },
  {
    id: 5,
    exercise_name: 'L-Sit Hold',
    prompt:
      'Side view of the same athletic Asian woman using low parallettes in the same modern gym studio to perform an L-sit hold. Arms are straight and locked, shoulders depressed away from ears, legs extended straight out in front at hip height forming a sharp L shape, toes pointed slightly. She maintains a tall chest and strong core, with a focused, confident look. Outfit, mat color, flooring, and softly blurred gym background are consistent with the previous images.',
  },
  {
    id: 6,
    exercise_name: 'Pike Push-Up Hold',
    prompt:
      'Three-quarter front view of the same athletic Asian woman in teal sports bra and charcoal leggings performing a pike push-up hold on the same dark green mat. Her hips are high forming an inverted V, hands on the mat slightly wider than shoulder width, legs straight, heels lightly off the floor. She is in the bottom position of the pike push-up with elbows bent and head lowered toward the mat, core tight, expression steady and composed. Background is the same modern gym with large windows and soft, natural light.',
  },
  {
    id: 7,
    exercise_name: 'Bear Crawl Hover Hold',
    prompt:
      'Side view of the same attractive athletic Asian woman in the same outfit performing a bear crawl hover hold on the same dark green mat in the same gym. Hands under shoulders, knees bent and hovering a few centimeters above the floor, back flat and parallel to the ground, core braced. Her gaze is slightly forward, face showing focused determination but calm breathing. The modern gym studio background, rubber flooring, large windows, and soft daylight remain consistent and slightly blurred to keep focus on her form.',
  },
];

const GenerateWorkoutImageInputSchema = z.object({
  exerciseName: z
    .string()
    .describe('The name of the workout exercise for which to generate an image.'),
});
export type GenerateWorkoutImageInput = z.infer<
  typeof GenerateWorkoutImageInputSchema
>;

const GenerateWorkoutImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "A data URI of the AI-generated image for the workout exercise, including a MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateWorkoutImageOutput = z.infer<
  typeof GenerateWorkoutImageOutputSchema
>;

export async function generateWorkoutImage(
  input: GenerateWorkoutImageInput
): Promise<GenerateWorkoutImageOutput> {
  return generateWorkoutImageFlow(input);
}

const generateWorkoutImageFlow = ai.defineFlow(
  {
    name: 'generateWorkoutImageFlow',
    inputSchema: GenerateWorkoutImageInputSchema,
    outputSchema: GenerateWorkoutImageOutputSchema,
  },
  async (input) => {
    const workoutPrompt = workoutImagePrompts.find(
      (item) => item.exercise_name === input.exerciseName
    );

    if (!workoutPrompt) {
      throw new Error(`No prompt found for exercise: ${input.exerciseName}`);
    }

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: workoutPrompt.prompt,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image or retrieve its URL.');
    }

    return { imageUrl: media.url };
  }
);
