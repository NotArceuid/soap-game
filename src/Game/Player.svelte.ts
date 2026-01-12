import { SaveSystem } from "./Saves.ts";
import { Decimal } from "./Shared/BreakInfinity/Decimal.svelte";

interface IPlayer {
  Name: string;
  Playtime: number,
  Tickets: Decimal,
  Money: Decimal;
  Charge: Decimal;
  SC: number;
  BulkAmount: number;
}

class PlayerClass {
  _player = $state<IPlayer>({
    Name: "Player",
    Playtime: 0,
    Money: new Decimal(0),
    Tickets: new Decimal(0),
    Charge: new Decimal(0),
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

  get Ticket() {
    return this._player.Tickets;
  }

  set Ticket(value) {
    this._player.Tickets = value;
  }

  get Charge() {
    return this._player.Charge;
  }

  set Charge(value) {
    this._player.Charge = value;
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
        ticket: this.Ticket,
        charge: this.Charge,
      }
    });

    SaveSystem.LoadCallback<IPlayerSaves>(this.saveKey, (data) => {
      this._player.Money = new Decimal(data.money);
      this._player.Playtime = data.playtime;
      this._player.Name = data.name
      this._player.Tickets = new Decimal(data.ticket);
      this._player.Charge = new Decimal(data.charge)
    });
  }
}

interface IPlayerSaves {
  version: string,
  playtime: number,
  name: string,
  money: Decimal,
  ticket: Decimal,
  charge: Decimal,
}

export const Player = new PlayerClass();
setInterval(() => {
  Player._player.Playtime += 1
}, 1000);
