/**
 * Image imports go through vite-imagetools. Import with `?w=<widths>&as=picture`; the Vite config adds
 * `format=avif;webp;<original>` so every such import resolves to a PictureSource.
 */
interface ImagetoolsPicture {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}
declare module '*&as=picture' {
  const picture: ImagetoolsPicture
  export default picture
}
declare module '*.svg' {
  const src: string
  export default src
}
