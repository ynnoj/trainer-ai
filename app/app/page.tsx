import { Fragment } from 'react'

export default function App() {
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
        </section>
      </main>
      <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white lg:block"></aside>
    </Fragment>
  )
}
