'use client'

import type { CreateCompletionResponse } from 'openai'

import { Fragment, useState } from 'react'

import CreateWorkoutForm from '../(marketing)/components/create-workout-form'

export default function App() {
  const [workouts, setWorkouts] = useState<CreateCompletionResponse[]>([])

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
          {workouts.map((workout: CreateCompletionResponse) => (
            <pre key={workout.id}>{JSON.stringify(workout, null, 2)}</pre>
          ))}
        </section>
      </main>
      <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white lg:block">
        <CreateWorkoutForm updateWorkouts={setWorkouts} />
      </aside>
    </Fragment>
  )
}
