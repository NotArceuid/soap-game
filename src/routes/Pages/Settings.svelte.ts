import { Notation } from "../../Game/Shared/BreakInfinity/Formatter.svelte.ts";

export enum ColorTheme {
  Light, Dark
}

interface SettingsType {
  Theme: ColorTheme;
  Format: Notation;
  Sounds: boolean;
}

export const Settings: SettingsType = $state({
  Theme: ColorTheme.Light,
  Format: Notation.Standard,
  Sounds: false,
})
