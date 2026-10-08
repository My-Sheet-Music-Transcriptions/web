import {
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import { Button } from '~/components/primitives/Button'
import { useSite } from '~/site'

export function ErrorPage({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({ strict: false, select: (state) => state.id === rootRouteId })
  const s = useSite().strings.errorPage
  console.error(error)
  return (
    <main id="main" className="container-content py-24 text-center">
      <h1 className="text-display">{s.title}</h1>
      <p className="mt-4 text-ink">{s.body}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" onClick={() => router.invalidate()}>
          {s.retry}
        </Button>
        {isRoot ? (
          <Button asChild>
            <Link to="/">{s.home}</Link>
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
              {s.back}
            </Link>
          </Button>
        )}
      </div>
    </main>
  )
}
