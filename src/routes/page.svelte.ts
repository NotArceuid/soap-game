import { PageHandler } from "./Pages/Pages";

export enum Pages {
  Soap,
  Settings,
  Cat,
  Achievements,
  HowTfDoIPlay,
}

export const MainPageHandler = new PageHandler<Pages>(true);
