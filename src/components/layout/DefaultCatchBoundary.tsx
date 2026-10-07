import {
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import { Button } from '~/components/primitives/Button'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({ strict: false, select: (state) => state.id === rootRouteId })
  console.error(error)
  return (
    <main id="main" className="container-content py-24 text-center">
      <h1 className="text-display">Something went wrong</h1>
      <p className="mt-4 text-ink">
        Please try again. If the problem persists, contact us by email.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" onClick={() => router.invalidate()}>
          Try again
        </Button>
        {isRoot ? (
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
            >
              Go back
            </Link>
          </Button>
        )}
      </div>
    </main>
  )
}
