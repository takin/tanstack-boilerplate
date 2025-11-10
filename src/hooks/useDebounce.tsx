import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timedout = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timedout)
  }, [value, delay])

  return debouncedValue
}
