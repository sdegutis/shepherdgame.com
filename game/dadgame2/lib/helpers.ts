export function removeFrom<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  array.splice(index, 1);
}
