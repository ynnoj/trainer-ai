import { createContext, useCallback, useContext, useState } from 'react'

interface ApplicationStateContextType {
  open: boolean
}
interface ApplicationDispatchContextType {
  toggleOpen: () => void
}

const ApplicationStateContext = createContext<ApplicationStateContextType>(
  null!
)
const ApplicationDispatchContext =
  createContext<ApplicationDispatchContextType>(null!)

function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <ApplicationDispatchContext.Provider
      value={{
        toggleOpen: useCallback(() => {
          setOpen((open) => !open)
        }, [])
      }}
    >
      <ApplicationStateContext.Provider value={{ open }}>
        {children}
      </ApplicationStateContext.Provider>
    </ApplicationDispatchContext.Provider>
  )
}

function useApplicationDispatch() {
  const context = useContext(ApplicationDispatchContext)

  if (context === undefined)
    throw new Error(
      'useApplicationDispatch must be used within an ApplicationProvider'
    )

  return context
}

function useApplicationState() {
  const context = useContext(ApplicationStateContext)

  if (context === undefined)
    throw new Error(
      'useApplicationState must be used within an ApplicationProvider'
    )

  return context
}

export { ApplicationProvider, useApplicationDispatch, useApplicationState }
