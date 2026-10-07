#!/bin/sh
# Netlify "ignore" command: exit 0 skips the build, exit 1 builds.
# Deploy previews and branch deploys of a locale site other than English are skipped: the English site's
# preview already serves every locale under /<locale> (see scripts/netlify-build.ts).
# Storybook and every production deploy always build.
if [ "${NETLIFY_TARGET:-site}" = "site" ] && [ "$CONTEXT" != "production" ] \
  && [ -n "$SITE_LOCALE" ] && [ "$SITE_LOCALE" != "en" ]; then
  echo "[netlify-ignore] $SITE_LOCALE: previews are built by the English site under /$SITE_LOCALE"
  exit 0
fi
exit 1
