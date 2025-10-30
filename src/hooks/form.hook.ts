import { createFormHook } from '@tanstack/react-form'

import {
  ProperSubmitButton,
  ProperTextField,
} from '../components/shared/ProperForm'
import { fieldContext, formContext } from './form.context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    ProperTextField,
  },
  formComponents: {
    ProperSubmitButton,
  },
  fieldContext,
  formContext,
})
