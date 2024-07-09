// export function removeFrom<T>(array: T[], item: T) {
//   const index = array.indexOf(item);
//   array.splice(index, 1);
// }

interface Entity {
  x: number;
  y: number;
}

export function intersects(a: Entity, b: Entity) {
  return (
    a.x + 7 >= b.x &&
    a.y + 7 >= b.y &&
    a.x <= b.x + 7 &&
    a.y <= b.y + 7
  );
}
