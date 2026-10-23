import { createFileRoute } from '@tanstack/react-router'

/**
 * The shop's endpoints (src/server/shop.server.ts):
 *   POST /api/shop/checkout         opens a payment for the cart
 *   POST /api/shop/stripe-webhook   Stripe's calls when a payment completes
 *   GET  /api/shop/order?session=   the order number of a paid checkout, for the cart's thank-you
 *   GET|POST /api/shop/orders       the orders panel's list and status changes, for shop staff only
 */
export const Route = createFileRoute('/api/shop/$action')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const shop = await import('~/server/shop.server')
        if (params.action === 'order') return shop.orderNumber(request)
        if (params.action === 'orders') return shop.ordersApi(request)
        return new Response('Not found', { status: 404 })
      },
      POST: async ({ request, params }) => {
        const shop = await import('~/server/shop.server')
        if (params.action === 'checkout') return shop.startCheckout(request)
        if (params.action === 'stripe-webhook') return shop.stripeWebhook(request)
        if (params.action === 'orders') return shop.ordersApi(request)
        return new Response('Not found', { status: 404 })
      },
    },
  },
})
