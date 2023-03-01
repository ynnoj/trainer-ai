'use client'

import type { CreateChatCompletionResponse } from 'openai'

import { Fragment, useState } from 'react'

import GenerateWorkoutForm from './components/generate-workout-form'

export default function App() {
  const [workouts, setWorkouts] = useState<CreateChatCompletionResponse[]>([])

  return (
    <Fragment>
      <main className="flex-1 overflow-y-auto">
        <section
          aria-labelledby="primary-heading"
          className="flex h-full min-w-0 flex-1 flex-col lg:order-last"
        >
          <h1 id="primary-heading" className="sr-only">
            Workouts
          </h1>
          {workouts.map((workout: CreateChatCompletionResponse) => (
            <pre key={workout.id}>{JSON.stringify(workout, null, 2)}</pre>
          ))}
        </section>
      </main>
      <GenerateWorkoutForm updateWorkouts={setWorkouts} />
    </Fragment>
  )
}
