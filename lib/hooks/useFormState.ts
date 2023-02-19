import { useReducer } from 'react'

enum FormActionType {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

interface FormState {
  formError: boolean
  formLoading: boolean
  formMessage: string
  formSuccess: boolean
}

interface FormAction {
  type: FormActionType
  payload?: Partial<FormState>
}

function formReducer(state: FormState, action: FormAction) {
  switch (action.type) {
    case FormActionType.ERROR:
      return {
        ...state,
        formError: true,
        formLoading: false,
        formSuccess: false,
        ...action.payload
      }
    case FormActionType.LOADING:
      return {
        ...state,
        formError: false,
        formLoading: true,
        formSuccess: false,
        ...action.payload
      }
    case FormActionType.SUCCESS:
      return {
        ...state,
        formError: false,
        formLoading: false,
        formSuccess: true,
        ...action.payload
      }
    default: {
      throw new Error(`Unhandled type: ${action.type}`)
    }
  }
}

function useFormState() {
  const [formState, formDispatch] = useReducer(formReducer, {
    formError: false,
    formLoading: false,
    formMessage: null,
    formSuccess: false
  })

  const setFormError = ({
    message: formMessage = 'Error'
  }: { message?: string } = {}) =>
    formDispatch({
      type: FormActionType.LOADING,
      payload: { formMessage }
    })

  const setFormLoading = ({
    message: formMessage = 'Loading'
  }: { message?: string } = {}) =>
    formDispatch({
      type: FormActionType.LOADING,
      payload: { formMessage }
    })

  const setFormSuccess = ({
    message: formMessage = 'Success',
    onSuccess
  }: { message?: string; onSuccess?: () => void } = {}) => {
    formDispatch({
      type: FormActionType.SUCCESS,
      payload: { formMessage }
    })

    if (onSuccess) onSuccess()
  }

  return {
    ...formState,
    setFormError,
    setFormLoading,
    setFormSuccess
  }
}

export default useFormState
