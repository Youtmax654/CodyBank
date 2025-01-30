import Account from '@/components/account/account'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_authenticated/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Account />
    </div>
  )
}
