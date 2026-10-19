# Catalan site inventory: lamevapartitura.cat

Part of the migration plan ([`../PLAN.md`](../PLAN.md)); machine-readable copy: [`ca.json`](./ca.json). Sources: the
live Yoast sitemaps (`page`, `product`, `product_cat`, `team`, `service`, `faq`), fetched 2026-10-19. The live site is
La Meva Partitura Edicions: a Catalan Elementor site (home, editions, My Music Book, about, contact) with a small
WooCommerce shop of songbooks. Every page below is ported as a data page (CMS-editable) on its live path; the old URLs
end with a slash and the new site 301s the slashed form (plan W1.3).

## Pages (ported)

| Path | Collection | translationKey | Notes | PR |
|---|---|---|---|---|
| [`/`](https://lamevapartitura.cat/) | pages | `home` |  | #PR |
| [`/gracies`](https://lamevapartitura.cat/gracies/) | pages | `thank-you` | noindex (thank-you page after the form) | #PR |
| [`/contacte`](https://lamevapartitura.cat/contacte/) | pages | `contact` |  | #PR |
| [`/sobre-nosaltres`](https://lamevapartitura.cat/sobre-nosaltres/) | pages | `about-us` |  | #PR |
| [`/shop`](https://lamevapartitura.cat/shop/) | pages | `shop` |  | #PR |
| [`/edicions`](https://lamevapartitura.cat/edicions/) | pages | `editions` |  | #PR |
| [`/my-musicbook`](https://lamevapartitura.cat/my-musicbook/) | pages | `my-musicbook` |  | #PR |
| [`/product/grans-exits-del-pop-espanyol`](https://lamevapartitura.cat/product/grans-exits-del-pop-espanyol/) | products | `grandes-exitos-pop-espanol-sony` |  | #PR |
| [`/product/canconer-de-nadal-2026`](https://lamevapartitura.cat/product/canconer-de-nadal-2026/) | products | `canconer-de-nadal-2026` |  | #PR |
| [`/product/colleccio-laura-andres`](https://lamevapartitura.cat/product/colleccio-laura-andres/) | products | `colleccio-laura-andres` |  | #PR |
| [`/product/la-oreja-de-van-gogh-songbook-1996-2026`](https://lamevapartitura.cat/product/la-oreja-de-van-gogh-songbook-1996-2026/) | products | `la-oreja-de-van-gogh-songbook` |  | #PR |

The shop takes no payments on the static site: each product's "Compra" opens an order form (`orderForm`) that the
team answers by email; the Laura Andrés collection keeps its link to laurandres.com as on live.

## Redirected (301, `content/ca/data/redirects.json`)

| Old path | Kind | Leads to | Why |
|---|---|---|---|
| `/sample-page` | page | `/` | WordPress draft, duplicate or WooCommerce page |
| `/descartes` | page | `/` | WordPress draft, duplicate or WooCommerce page |
| `/contacte-2` | page | `/contacte` | WordPress draft, duplicate or WooCommerce page |
| `/redisseny-home` | page | `/` | WordPress draft, duplicate or WooCommerce page |
| `/el-meu-compte` | page | `/shop` | WordPress draft, duplicate or WooCommerce page |
| `/cistella` | page | `/shop` | WordPress draft, duplicate or WooCommerce page |
| `/pagament` | page | `/shop` | WordPress draft, duplicate or WooCommerce page |
| `/categoria-product/*` (1 URL) | product_cat | `/shop` | WooCommerce category |
| `/team/*` (31 URLs) | team | `/sobre-nosaltres` | English team cards, linked from nowhere |
| `/service/*` (42 URLs) | service | `/` | English service cards, linked from nowhere |
| `/faq/*` (102 URLs) | faq | `/` | English FAQ entries, linked from nowhere |

## Later (not part of the port)

The core set every other locale has (pricing, reviews, FAQ, service pages, legal pages in Catalan, a blog) does not
exist on the live Catalan site; create it through the `page` skill when wanted (each new page starts as a mockup).
Until then the footer's legal links lead to the English pages.
