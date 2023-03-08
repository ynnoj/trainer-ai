'use client'

import type { CreateChatCompletionResponse } from 'openai'

import { Fragment, useState } from 'react'

import GenerateWorkoutForm from './components/generate-workout-form'
import SlideOver from '../components/slide-over'
import {
  useApplicationDispatch,
  useApplicationState
} from '../../lib/hooks/useApplicationState'

export default function App() {
  const { toggleOpen } = useApplicationDispatch()
  const { open } = useApplicationState()
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
      <aside className="hidden w-96 border-l lg:block">
        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
          <div className="border-b px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold leading-6 text-gray-900">
                Generate workout
              </h2>
            </div>
          </div>
          <GenerateWorkoutForm updateWorkouts={setWorkouts} />
        </div>
      </aside>
      <SlideOver open={open} toggleOpen={toggleOpen}>
        <GenerateWorkoutForm
          onLoading={toggleOpen}
          updateWorkouts={setWorkouts}
        />
      </SlideOver>
    </Fragment>
  )
}
