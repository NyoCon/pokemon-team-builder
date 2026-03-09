# PokéTeam – FireRed / LeafGreen Team Builder

A web app for planning Pokémon teams for **FireRed & LeafGreen**. Build your team, assign moves, analyze type coverage, and check matchups against opponents — all in the browser, no backend required.

**Live:** https://nyocon.github.io/pokemon-team-builder/

---

## Features

- **Team Builder** — 6 slots, each with a Pokémon picker and 4 move slots
- **Type Effectiveness** — per-move effectiveness chart (2×, ½×, 0×), collapsible
- **STAB indicator** — highlights moves that match the Pokémon's type
- **Opponent Analysis** — pick a 7th defender Pokémon and see which team moves hit super effectively, sorted by effective damage
- **Pokémon Box** — save pre-configured Pokémon (with moves) independently and assign them to any team slot
- **Team Manager** — save, load, and delete named teams; share via URL
- **5 languages** — EN, DE, FR, IT, ES
- **Light / Dark mode**
- **Offline-capable** — all data cached in localStorage after first load

## Scope

FireRed / LeafGreen only: Gen 1 Pokémon (#001–#151), moves from the Gen 1–3 era. Data sourced from [PokéAPI](https://pokeapi.co/).

## Tech Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Zustand](https://zustand.docs.pmnd.rs/) (state + localStorage persistence)
- [TailwindCSS v4](https://tailwindcss.com/)
- PokéAPI (client-side only, no backend)

## Local Development

```bash
npm install
npm run dev
```

## URL Parameters

| Parameter | Effect |
|-----------|--------|
| `?team=…` | Load a shared team directly |
| `?clear`  | Wipe all localStorage cache |
