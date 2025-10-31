import { motion, MotionProps } from 'framer-motion'

function MotionDivBase({ children, ...props }: MotionProps) {
  return <motion.div {...props}>{children}</motion.div>
}

function MotionDivDefault({
  children,
  ...props
}: React.PropsWithChildren<MotionProps>) {
  return (
    <MotionDivBase
      {...{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5 },
      }}
      {...props}
    />
  )
}

export const MotionDiv = {
  raw: ({ children, ...props }: React.PropsWithChildren<MotionProps>) => (
    <MotionDivBase {...props}>{children}</MotionDivBase>
  ),
  default: MotionDivDefault,
  moveUp: ({
    children,
    delay = 0,
    distance = 20,
    duration = 0.5,
    ...rest
  }: React.PropsWithChildren<
    MotionProps & {
      delay?: number
      distance?: number
      duration?: number
      className?: string
    }
  >) => (
    <MotionDivDefault
      {...{
        initial: { opacity: 0, y: distance },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -distance },
        transition: { duration, delay },
      }}
      {...rest}
    >
      {children}
    </MotionDivDefault>
  ),
  moveDown: ({
    children,
    delay = 0,
    distance = 20,
    duration = 0.5,
    ...rest
  }: React.PropsWithChildren<
    MotionProps & {
      delay?: number
      distance?: number
      duration?: number
      className?: string
    }
  >) => (
    <MotionDivDefault
      {...{
        initial: { opacity: 0, y: -distance },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: distance },
        transition: { duration, delay },
      }}
      {...rest}
    >
      {children}
    </MotionDivDefault>
  ),
  moveLeft: ({
    children,
    delay = 0,
    distance = 20,
    duration = 0.5,
    ...rest
  }: React.PropsWithChildren<
    MotionProps & {
      delay?: number
      distance?: number
      duration?: number
      className?: string
    }
  >) => (
    <MotionDivDefault
      {...{
        initial: { opacity: 0, x: -distance },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: distance },
        transition: { duration: 0.5, delay },
      }}
      {...rest}
    >
      {children}
    </MotionDivDefault>
  ),
  moveRight: ({
    children,
    delay = 0,
    distance = 20,
    duration = 0.5,
    ...rest
  }: React.PropsWithChildren<
    MotionProps & {
      delay?: number
      distance?: number
      duration?: number
      className?: string
    }
  >) => (
    <MotionDivDefault
      {...{
        initial: { opacity: 0, x: distance },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -distance },
        transition: { duration, delay },
      }}
      {...rest}
    >
      {children}
    </MotionDivDefault>
  ),
  fadeIn: ({
    children,
    delay = 0,
    duration = 0.5,
    ...rest
  }: React.PropsWithChildren<
    MotionProps & { delay?: number; duration?: number; className?: string }
  >) => (
    <MotionDivDefault
      {...{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration, delay },
      }}
      {...rest}
    >
      {children}
    </MotionDivDefault>
  ),
}
