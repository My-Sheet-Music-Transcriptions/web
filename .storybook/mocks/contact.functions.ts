/** Storybook stand-in for the server function: no network, resolves after a short delay. */
export type ContactResult = { ok: true } | { ok: false; errors: Record<string, string> }
export async function submitContact(_opts: { data: FormData }): Promise<ContactResult> {
  await new Promise((r) => setTimeout(r, 400))
  return { ok: true }
}
