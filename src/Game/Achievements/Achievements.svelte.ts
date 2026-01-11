import { SvelteMap } from "svelte/reactivity";
import { InvokeableEvent } from "../Shared/Events";
import type { Decimal } from "../Shared/BreakInfinity/Decimal.svelte";

export const UnlockAchievement: InvokeableEvent<AchievementKey> = new InvokeableEvent<AchievementKey>();
export function InvokeAchievement(key: AchievementKey) { UnlockAchievement.invoke(key); }

export enum AchievementKey {
  Soapy, Gooder, Businessman, Automation, OCD, Millionaire, Deccelerate, HighSpeed, Accelerate, Deccelerate2, EatSoap
}

export const AchievementsData: Record<AchievementKey, IAchievement> = {
  [AchievementKey.Soapy]: {
    name: "Soapy",
    description: "Produce your first soap",
    check: (...props) => props[0].gt(1),
  },
  [AchievementKey.Gooder]: {
    name: "Gooder",
    description: "Upgrade the soap producer once",
    check: (...props) => props[0].gt(1),
  },
  [AchievementKey.Businessman]: {
    name: "Businessman",
    description: "Sell your first soap",
    check: (...props) => props[0].gt(1)
  },
  [AchievementKey.Automation]: {
    name: "Red soap automation",
    description: "The factory must grow!!",
    check: (...props) => props[0].gt(1)
  },
  [AchievementKey.OCD]: {
    name: "5 squares",
    description: "Get more than 25 quality and speed upgrades",
    check: (...props) => props[0].gte(25) && props[1].gte(25)
  },
  [AchievementKey.Millionaire]: {
    name: "Millionaire",
    description: "Get more than 1 million money",
    check: (...props) => props[0].gt(1000000),
  },
  [AchievementKey.Deccelerate]: {
    name: "Quality over quantity",
    description: "Deccelerate once",
    check: (...props) => props[0].gt(0),
  },
  [AchievementKey.HighSpeed]: {
    name: "High Speed",
    description: "Overcap your speed while deccelerating",
    check: (...props) => props[0].gt(props[1])
  },
  [AchievementKey.Accelerate]: {
    name: "Too slow for me..",
    description: "Accelerate once",
    check: (...props) => props[0].gt(1)
  },
  [AchievementKey.Deccelerate2]: {
    name: "Deccelerate 2",
    description: "You've passed deccelerate 2, now be prepare for the wall",
    check: (...props) => props[0].gt(1)
  },
  [AchievementKey.EatSoap]: {
    name: "Eat Soap",
    description: "Why... just why??",
    check: (...props) => props[0].gt(0)
  }
};

export interface IAchievement {
  name: string,
  description: string,
  check: (...props: Decimal[]) => boolean;
  unlocked?: boolean
}

// Decelerate.. I hope you enjoy stacking speed upgrades
// 25 T- seat soap desc: The wall is now over
