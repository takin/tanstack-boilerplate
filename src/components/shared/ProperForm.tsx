import { useFieldContext, useFormContext } from '@/hooks/form.context'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export function ProperTextField({
  id,
  label,
  type,
  placeholder,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string
}) {
  const field = useFieldContext<string>()

  return (
    <>
      <Label htmlFor={field.name ?? ''}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        {...props}
      />
      {field.state.meta.errors && (
        <p className="text-red-500 text-sm">
          {field.state.meta.isTouched &&
            field.state.meta.errors.map((error) => error.message).join(', ')}
        </p>
      )}
    </>
  )
}

export function ProperSubmitButton({
  label,
  ...props
}: React.ComponentProps<typeof Button> & {
  label: string
}) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button type="submit" disabled={isSubmitting || !canSubmit} {...props}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : label}
        </Button>
      )}
    </form.Subscribe>
  )
}
