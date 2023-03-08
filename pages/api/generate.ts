import type { AuthObject } from '@clerk/nextjs/dist/api'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { WorkoutInputs } from '../../app/app/components/generate-workout-form'
import type {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse
} from 'openai'

import { getAuth } from '@clerk/nextjs/server'

import fetcher, { CustomError } from '../../lib/fetcher'

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
    const { userId }: AuthObject = getAuth(req)

    if (!userId) return res.status(401).json({ message: 'Please authenticate' })

    const generatePrompt = (type: WorkoutInputs['type']): string | void => {
      switch (type) {
        case 'amrap':
          return generateAmrapPrompt(req.body as WorkoutInputs)
        case 'emom':
          return generateEmomPrompt(req.body as WorkoutInputs)
        default:
          return res.status(400).json({ message: 'Invalid workout type' })
      }
    }

    const prompt = generatePrompt(req.body.type)

    const workout = await fetcher<CreateChatCompletionResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8
        } as CreateChatCompletionRequest)
      }
    )

    res.status(201).json(workout)
  } catch (error) {
    const { info, status } = error as CustomError

    res.status(status).json({ message: info.message })
  }
}
