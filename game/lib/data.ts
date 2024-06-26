import { Entity } from "../entities/entity.js";
import { Player } from "../entities/player.js";

export interface Actable {
  actOn(player: Player): boolean;
  entity: Entity;
}

export interface Updatable {
  update(t: number): void;
}

export const drawables: Entity[] = [];
export const players: Player[] = [];
export const actables: Actable[] = [];
export const updatables: Updatable[] = [];
