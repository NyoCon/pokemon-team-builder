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
- **Offline-capable** — all PokeAPI data bundled as static files, no runtime API calls

## Scope

FireRed / LeafGreen only: Pokémon #001–#251, moves from the Gen 1–3 era. Data sourced from [PokéAPI](https://pokeapi.co/).

## Tech Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Zustand](https://zustand.docs.pmnd.rs/) (state + localStorage persistence)
- [TailwindCSS v4](https://tailwindcss.com/)

## Local Development

```bash
npm install
npm run dev
```

## Updating game data

All PokeAPI data is stored as static JSON files in `public/data/` and shipped with the app. To regenerate:

```bash
npm run fetch-data
```

This updates:

| File | Content |
|------|---------|
| `public/data/pokemon.json` | Names, types, sprites for Pokémon 1–251 |
| `public/data/types.json` | Type chart + localized type names |
| `public/data/moves.json` | All Gen 1–3 moves with FR/LG-era power values |
| `public/data/items.json` | Held items with sprites and localized names |

The script fetches from PokeAPI and takes ~2 minutes. Commit the updated files afterwards.

> If you add new items to `src/data/items.ts`, mirror the change in `FRLG_ITEM_SLUGS` in `scripts/fetch-data.mjs` and re-run the script.

## URL Parameters

| Parameter | Effect |
|-----------|--------|
| `?team=…` | Load a shared team directly |
| `?clear`  | Wipe localStorage |
