import type { NextApiRequest, NextApiResponse } from 'next'
import type { WorkoutInputs } from '../../app/(marketing)/components/create-workout-form'

import { Configuration, OpenAIApi } from 'openai'
import { encode } from 'gpt-3-encoder'

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
)

const generateAmrapPrompt = ({ duration, movements }: WorkoutInputs): string =>
  `Create me a ${duration} minute AMRAP style workout, using only the following movements:

  ${movements.join()}
  
Don't include a warm-up and use kilograms. Don't include any extra instructions and use as few points as required. Return in Markdown.

Desired format:
<workout_type_acronym> • <workout_duration> minutes
- <cardio_metres> <movement>
- <weight_repetition> <movement> (<male_weight_kg>/<female_weight_kg> kg)
..
Workout:`

const generateEmomPrompt = ({ duration, movements }: WorkoutInputs): string =>
  `Create me a EMOM style workout using only the following movements:

  ${movements.join()}

The workout should be approximately ${duration} minutes in length, where the calculated length must be divisible by ${
    movements.length
  }}. Metres and repetitions should be achievable within the 1 minute interval.
  
Don't include a warm-up and use kilograms. Don't include any extra instructions and use as few points as required. Return in Markdown.

Desired format:
<workout_type_acronym> • <workout_duration> minutes
- <cardio_metres> <movement>
- <weight_repetition> <movement> (<male_weight_kg>/<female_weight_kg> kg)
..
Workout:`

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const generatePrompt = (type: WorkoutInputs['type']): string => {
      switch (type) {
        case 'amrap':
          return generateAmrapPrompt(req.body as WorkoutInputs)
        case 'emom':
          return generateEmomPrompt(req.body as WorkoutInputs)
        default:
          throw new Error(`Unknown workout type: ${type}`)
      }
    }

    const prompt = generatePrompt(req.body.type)

    const { data: workout } = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.8,
      max_tokens: Number(4096 - encode(prompt).length)
    })

    res.status(201).json(workout)
  } catch ({
    response: {
      data: { error },
      status
    }
  }) {
    console.log(error)
    res.status(status).json({ error })
  }
}
