import { SaveSystem } from "./Saves.ts";
import { Decimal } from "./Shared/BreakInfinity/Decimal.svelte";

interface IPlayer {
  Name: string;
  Playtime: number,
  Money: Decimal;
  SC: number;
  BulkAmount: number;
}

class PlayerClass {
  _player = $state<IPlayer>({
    Name: "Player",
    Playtime: 0,
    Money: new Decimal(0),
    SC: 0,
    BulkAmount: 1,
  });

  get BulkAmount() {
    return this._player.BulkAmount;
  }

  set BulkAmount(value) {
    this._player.BulkAmount = value;
  }

  get Name() {
    return this._player.Name;
  }

  get Money() {
    return this._player.Money;
  }

  set Money(value) {
    this._player.Money = value;
  }

  saveKey: string = "player";
  constructor() {
    SaveSystem.SaveCallback<IPlayerSaves>(this.saveKey, () => {
      return {
        //@ts-ignore
        version: PKG_VERSION,
        playtime: Player._player.Playtime,
        name: this.Name,
        money: this.Money,
      }
    });

    SaveSystem.LoadCallback<IPlayerSaves>(this.saveKey, (data) => {
      this._player.Money = new Decimal(data.money);
      this._player.Playtime = data.playtime;
      this._player.Name = data.name
    });
  }
}

interface IPlayerSaves {
  version: string,
  playtime: number,
  name: string,
  money: Decimal,
}

export const Player = new PlayerClass();
setInterval(() => {
  Player._player.Playtime += 1
}, 1000);
