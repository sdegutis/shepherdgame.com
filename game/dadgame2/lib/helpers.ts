import { Entity } from "../entities/entity.js";

export function removeFrom<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  array.splice(index, 1);
}

export function intersects(a: Entity, b: Entity) {
  return (
    a.x + 8 >= b.x &&
    a.y + 8 >= b.y &&
    a.x < b.x + 8 &&
    a.y < b.y + 8
  );
}
