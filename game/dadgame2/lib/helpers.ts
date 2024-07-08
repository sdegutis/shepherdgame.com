import { Entity } from "../entities/entity.js";

export function removeFrom<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  array.splice(index, 1);
}

export function intersects(a: Entity, b: Entity) {
  return (
    a.x + a.w >= b.x &&
    a.y + a.h >= b.y &&
    a.x < b.x + b.w &&
    a.y < b.y + b.h
  );
}
