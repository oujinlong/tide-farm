export function simulateTide(map: readonly (readonly string[])[], tideLevel: number) {
  const flooded = map.map((row) => row.map(() => false));
  const queue: [x: number, y: number][] = [];
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function visit(x: number, y: number) {
    const tile = map[y]?.[x];
    if (tile === undefined || tile === 'X' || flooded[y][x]) return;
    const height = tile === '~' ? -1 : tile === '#' ? 2 : tile === '.' ? 1 : 0;
    if (height >= tideLevel) return;
    flooded[y][x] = true;
    queue.push([x, y]);
  }

  for (const [y, row] of map.entries()) {
    for (const [x, tile] of row.entries()) {
      if (tile === '~' && (x === 0 || y === 0 || x === row.length - 1 || y === map.length - 1)) visit(x, y);
    }
  }
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    for (const [dx, dy] of directions) visit(x + dx, y + dy);
  }
  return flooded;
}
