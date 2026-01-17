import { SaveSystem } from "../../Game/Saves.ts";
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

let saveKey = "settings"
SaveSystem.SaveCallback<SettingsType>(saveKey, () => {
  return Settings;
})

SaveSystem.LoadCallback<SettingsType>(saveKey, (data) => {
  Settings.Theme = data.Theme;
  Settings.Format = data.Format;
  Settings.Sounds = data.Sounds;
})
