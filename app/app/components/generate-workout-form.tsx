'use client'

import type { CreateChatCompletionResponse } from 'openai'

import { Disclosure } from '@headlessui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

import fetcher, { CustomError } from '../../../lib/fetcher'
import useFormState from '../../../lib/hooks/useFormState'
import { useApplicationDispatch } from '../../../lib/hooks/useApplicationState'

const schema = z
  .object({
    duration: z.number(),
    movements: z
      .array(z.string())
      .max(6, { message: 'You can select a maximum of 6 movements' })
      .min(3, { message: 'Please select at least 3 movements' }),
    type: z.enum(['amrap', 'emom'])
  })
  .required()

export type WorkoutInputs = z.infer<typeof schema>

export default function GenerateWorkoutForm({
  updateWorkouts
}: {
  updateWorkouts: React.Dispatch<
    React.SetStateAction<CreateChatCompletionResponse[]>
  >
}) {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<WorkoutInputs>({
    defaultValues: {
      duration: 20,
      movements: [],
      type: 'amrap'
    },
    resolver: zodResolver(schema)
  })
  const { toggleOpen } = useApplicationDispatch()
  const { setFormError, setFormLoading, setFormSuccess } = useFormState()

  const onSubmit: SubmitHandler<WorkoutInputs> = async (data) => {
    try {
      setFormLoading({
        onLoading: () => toggleOpen()
      })

      const workout = await fetcher<CreateChatCompletionResponse>(
        '/api/generate',
        {
          body: JSON.stringify(data),
          method: 'POST'
        }
      )

      setFormSuccess({
        onSuccess: () =>
          updateWorkouts((workouts) => [
            ...workouts,
            workout as CreateChatCompletionResponse
          ])
      })
    } catch (error) {
      const { message } = error as CustomError

      setFormError({ message })
    }
  }

  return (
    <form
      className="flex h-full flex-col overflow-y-scroll"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative flex-1 overflow-y-scroll px-4 sm:px-6">
        <div className="space-y-6 divide-y divide-gray-200 py-6">
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <div className="space-y-6">
                <Disclosure.Button
                  as="div"
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Basics
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Choose the duration and type of your workout
                      </p>
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="mt-4 space-y-4">
                  <fieldset>
                    <legend className="sr-only">Type</legend>
                    <div
                      className="text-base font-medium text-gray-900"
                      aria-hidden="true"
                    >
                      Type
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          {...register('type')}
                          id="type-field-emom"
                          value="emom"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="type-field-emom"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          EMOM
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register('type')}
                          id="type-field-amrap"
                          value="amrap"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="type-field-amrap"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          AMRAP
                        </label>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="sr-only">Duration</legend>
                    <div
                      className="text-base font-medium text-gray-900"
                      aria-hidden="true"
                    >
                      Duration
                    </div>
                    <div className="mt-4 grid grid-cols-1 space-y-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="duration-field"
                          className="block text-sm font-medium text-gray-700"
                        ></label>
                        <div className="mt-1">
                          <select
                            {...register('duration', {
                              valueAsNumber: true
                            })}
                            id="duration-field"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value={15}>15 minutes</option>
                            <option value={20}>20 minutes</option>
                            <option value={30}>30 minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <div className="space-y-6 pt-6">
                <Disclosure.Button
                  as="div"
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Movements
                      </h3>
                      <p
                        className={`${
                          errors.movements ? 'text-red-500' : ''
                        } mt-1 text-sm text-gray-500`}
                      >
                        {errors.movements
                          ? errors.movements.message
                          : `Select up to 6 movements`}
                      </p>
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="space-y-4">
                  <fieldset>
                    <legend className="sr-only">Cardio</legend>
                    <div
                      className="text-base font-medium text-gray-900"
                      aria-hidden="true"
                    >
                      Cardio
                    </div>
                    <p className="text-sm text-gray-500">
                      All movements will be in metres unless stated otherwise
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-rowerg"
                            value="row-metres"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-rowerg"
                            className="font-medium text-gray-700"
                          >
                            RowErg
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-bikeerg"
                            value="bike-metres"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-bikeerg"
                            className="font-medium text-gray-700"
                          >
                            BikeErg
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-skierg"
                            value="ski-metres"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-skierg"
                            className="font-medium text-gray-700"
                          >
                            SkiErg
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-run"
                            value="run"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-run"
                            className="font-medium text-gray-700"
                          >
                            Running
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="sr-only">Barbell</legend>
                    <div
                      className="text-base font-medium text-gray-900"
                      aria-hidden="true"
                    >
                      Barbell
                    </div>
                    <p className="text-sm text-gray-500">
                      All movements will be in KG unless stated otherwise
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-barbell-deadlifts"
                            value="barbell-deadlifts"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-barbell-deadlifts"
                            className="font-medium text-gray-700"
                          >
                            Deadlifts
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-barbell-thrusters"
                            value="barbell-thrusters"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-barbell-thrusters"
                            className="font-medium text-gray-700"
                          >
                            Thrusters
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-barbell-power-cleans"
                            value="barbell-power-cleans"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-barbell-power-cleans"
                            className="font-medium text-gray-700"
                          >
                            Power cleans
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-barbell-squat-cleans"
                            value="barbell-squat-cleans"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-barbell-squat-cleans"
                            className="font-medium text-gray-700"
                          >
                            Squat cleans
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="sr-only">Gymnastics</legend>
                    <div
                      className="text-base font-medium text-gray-900"
                      aria-hidden="true"
                    >
                      Gymnastics
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-hspu"
                            value="handstands-push-ups"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-hspu"
                            className="font-medium text-gray-700"
                          >
                            Handstand push-ups
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-pullups"
                            value="pull-ups"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-pullups"
                            className="font-medium text-gray-700"
                          >
                            Pull-ups
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-ttb"
                            value="toes-to-bar"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-ttb"
                            className="font-medium text-gray-700"
                          >
                            Toes to bar
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-barmu"
                            value="bar-muscle-ups"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-barmu"
                            className="font-medium text-gray-700"
                          >
                            Bar muscle-ups
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            {...register('movements')}
                            id="movements-field-ringmu"
                            value="ring-muscle-ups"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="movements-field-ringmu"
                            className="font-medium text-gray-700"
                          >
                            Ring muscle-ups
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        </div>
      </div>
      <div className="flex flex-shrink-0 justify-end border-t px-4 py-4">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Generate
        </button>
      </div>
    </form>
  )
}
