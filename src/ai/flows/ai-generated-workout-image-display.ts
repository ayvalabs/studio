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
      'Full-body side view of an exceptionally attractive athletic Asian woman with long, flowing dark hair and fair skin, beaming with a happy and confident smile. She is wearing a deep teal sports bra and charcoal gray high-waisted leggings, performing a perfect forearm plank on a dark green mat in a modern gym studio with large windows and soft daylight. Her body forms a straight line from head to heels. Background is a consistent neutral, slightly blurred gym environment.',
  },
  {
    id: 2,
    exercise_name: 'Wall Sit',
    prompt:
      'Three-quarter side view of the same exceptionally attractive athletic Asian woman with long flowing hair and fair skin, smiling brightly and happily. She is in the same teal sports bra and charcoal leggings performing a wall sit against a light gray wall in the same modern gym studio. Her back is flat on the wall, hips and knees at 90 degrees, face showing happy determination. Background matches previous images.',
  },
  {
    id: 3,
    exercise_name: 'Single-Leg Glute Bridge Hold',
    prompt:
      'Side view of the same attractive athletic Asian woman with long hair and fair skin, smiling happily, on a dark green mat in the same gym. She is performing a single-leg glute bridge hold. One foot is planted firmly on the mat, the other leg extended straight out, hips lifted high. Her expression is radiant and focused. Clothing and background are identical to previous images.',
  },
  {
    id: 4,
    exercise_name: 'Hollow Body Hold',
    prompt:
      'Angled overhead view of the same attractive Asian woman with long hair and fair skin, smiling cheerfully, performing a hollow body hold on the same mat. She lies on her back with lower back pressed into the mat, shoulders and legs lifted off the floor, arms extended overhead. Her face shows happy concentration. The modern gym studio background is consistent and slightly blurred.',
  },
  {
    id: 5,
    exercise_name: 'L-Sit Hold',
    prompt:
      'Side view of the same athletic Asian woman with long flowing hair and fair skin, smiling confidently and happily, using low parallettes in the same modern gym studio to perform an L-sit hold. Arms are straight, legs extended straight out in front forming a sharp L shape. She looks radiant and strong. Outfit and softly blurred gym background are consistent.',
  },
  {
    id: 6,
    exercise_name: 'Pike Push-Up Hold',
    prompt:
      'Three-quarter front view of the same athletic Asian woman with long hair and fair skin, smiling happily, performing a pike push-up hold on the same dark green mat. Her hips are high, hands on the mat, head lowered toward the mat. She maintains a cheerful and composed expression. Background is the same modern gym with soft, natural light.',
  },
  {
    id: 7,
    exercise_name: 'Bear Crawl Hover Hold',
    prompt:
      'Side view of the same attractive athletic Asian woman with long hair and fair skin, smiling brightly, performing a bear crawl hover hold on the same dark green mat in the same gym. Hands under shoulders, knees hovering just above the floor, back flat. Her face shows happy determination. Background remains consistent and slightly blurred.',
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
