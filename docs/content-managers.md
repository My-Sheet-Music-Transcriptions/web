# Working on the website with Claude: a guide for content managers and writers

The website has no admin panel. You change it by talking to Claude Code, in your own words and in your own
language. Claude shows you a preview of every change before anything is built, shows you the real page on a
test address before anything goes live, and publishes only when you say yes. This guide says what you can
ask for, what you will receive at each step, and what you need to answer.

The same guide in Spanish: [`content-managers.es.md`](./content-managers.es.md); in Catalan:
[`content-managers.ca.md`](./content-managers.ca.md). Type `/site-help` in Claude Code for a short version.

## What you can ask for

- **A new page**: a landing page, a service page, an information page, on any of the sites (English,
  Spanish, Catalan, French, German, Japanese). Or "bring over" a page from the current live site.
- **A change to an existing page**: a sentence, a picture, a price, a section, the order of sections.
- **A translation** of a page into another of the site's languages.
- **Design work**: explore the look of a page or a section, compare two or three options side by side.
- **Where things are**: whether a page is live, waiting for you, or still a preview.

Say it the way you would to a colleague: "I need a page about choir arrangements for the Spanish site, people
should end up asking for a quote", "change the price of piano transcriptions to 45 €", "show me two options
for the home page hero". Paste or attach the text and pictures you already have.

## The commands

Typing `/` in Claude Code shows them; each one starts the right conversation. Plain requests without a
command work too.

| Command | What it does |
| --- | --- |
| `/new-page [name or live URL] [language]` | a new page, or a page brought over from the live site |
| `/edit-page <page> [what changes]` | a change to an existing page; everything else stays |
| `/translate <page> <language>` | the same page in another language |
| `/design <page or idea>` | work on the look on a design canvas, compare options |
| `/publish <page>` | put an approved preview live |
| `/status [page]` | where every page is right now, with links |
| `/site-help` | a short version of this guide, in your language |

## How a request goes

1. **A few questions.** Claude asks only what it cannot work out: which page and which site, what the page
   should achieve, what goes on it. Answers are clickable; "Other" lets you type.
2. **The preview.** Within a few minutes you get a link to a private preview of the page, rendered with the
   real site components. At the top you can switch between desktop, tablet and phone. Commenting is on
   from the start: click any part of the page and write what should change (turn **Comment** off to click
   links inside the page); or simply tell Claude in the conversation. Tell Claude when you are done commenting (comments do not reach it on their own).
   Claude updates the same preview until you say it is right. Text Claude does not have shows as
   `[PLACEHOLDER]`: it never invents copy, prices or numbers.
3. **The question.** When the preview is right, Claude asks: "Shall I publish this to the live site?".
   Nothing is built before you answer yes.
4. **The real page on a test address.** Claude builds the page and runs every check (accessibility,
   speed, search-engine rules, broken links). A few minutes later you get a link to the real page on a
   test address and the question "Does it look right?". Ask for changes here as often as you need; each
   time you get the link again.
5. **Live.** On your yes Claude publishes and, once the site has deployed (a few minutes), sends you the
   live link. If anything fails on the way, Claude fixes it and tells you.

Page text, pictures, prices and translations go live on your yes alone. A change that also touches how the
site works (a new kind of section, the contact form, the menus' code) waits for an engineer from the core team
to approve it first; Claude tells you when that is the case, and the page goes live as soon as they approve.

Each link comes as a message in the conversation and, when it arrives later, as a notification too.

## Design mode

Ask for "design", "options", "a mockup" or type `/design` when you want to work on the look rather than
the words. Instead of the plain preview you get a **design canvas**: a desktop and a phone artboard for
each option, side by side, with a note listing the sections. You can move things, retype the text of
hand-drawn sections, add your own notes, and compare options. The real site parts (header, footer, forms,
cards) are shown live and change by asking Claude. When you are done or have chosen an option, say so:
Claude takes the design back into the normal flow (preview question → test address → live).

## Text, pictures and numbers

- **Text**: give Claude the final wording when you have it; otherwise it shows a placeholder and asks.
  Claude keeps the live site's spelling (American English) and never "improves" copy unless asked.
- **Pictures**: paste or attach them, or name the live-site page they are on. Good pictures are at least
  1200 px wide; Claude resizes and converts them for the web and writes a short description for people who
  cannot see them (you can give that description yourself).
- **Numbers**: prices, review counts, ratings and phone numbers live in one place and appear on every page
  that shows them. Ask to change a number once and every page follows.

## Languages

Each language is its own site on its own address. A translated page can be previewed and built today; the
menu and footer of the other-language sites still show English until those sites are set up, and Claude
will tell you so before building a translation. Claude answers in the language you write in.

## Questions people ask

- **How long does it take?** A preview: minutes. The test address: a few minutes after your yes. Live: a
  few minutes after your second yes.
- **Who can see the preview?** Only people you share the link with. The test address is public but not
  linked from anywhere.
- **Can I undo?** Yes: ask Claude to change it back, with the same preview and test steps. Nothing goes
  live without the two yeses.
- **Something looks wrong on the live site.** Tell Claude which page and what you see; it checks, fixes
  and reports.
- **Where are my pages?** `/status` lists every page in progress with its links and what it waits for.
