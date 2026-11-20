import { simulateTide } from './tide';

const map = [
  '~###############',
  '~#####....######',
  '~######...######',
  '~##rrr####ttt###',
  '~##rrr####ttt###',
  '~==X==####ttt###',
  '~###############',
  '~####....#######',
  '~#####..########',
  '~###############',
  '~###############',
  '~###############',
].map((row) => [...row]);
const size = 40;
const gateX = 3;
const gateY = 5;
const canvas = document.querySelector<HTMLCanvasElement>('#farm')!;
const gate = document.querySelector<HTMLButtonElement>('#gate')!;
const status = document.querySelector<HTMLParagraphElement>('#status')!;
canvas.width = map[0].length * size;
canvas.height = map.length * size;
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('当前浏览器不支持 Canvas 2D');

function draw(ctx: CanvasRenderingContext2D) {
  const flooded = simulateTide(map, 1);
  const open = map[gateY][gateX] === 'G';
  let wetRice = 0;
  for (const [y, row] of map.entries()) {
    for (const [x, tile] of row.entries()) {
      const wet = flooded[y][x];
      const left = x * size;
      const top = y * size;
      ctx.fillStyle = tile === '~' ? '#256680' : wet ? '#7dcbeb' : tile === '#' ? '#53765b' : '#967b52';
      ctx.fillRect(left, top, size - 1, size - 1);
      if (tile === 'r' || tile === 't') {
        if (tile === 'r' && wet) wetRice++;
        ctx.fillStyle = tile === 'r' ? '#ffe291' : '#a52538';
        ctx.fillRect(left + 13, top + 13, 14, 14);
      }
      if (tile === 'X' || tile === 'G') {
        ctx.fillStyle = '#152b29';
        ctx.fillRect(left + 8, top + 8, 24, 24);
        ctx.fillStyle = '#fff';
        ctx.font = '16px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(open ? '开' : '关', left + size / 2, top + size / 2);
      }
    }
  }
  gate.setAttribute('aria-pressed', String(open));
  status.textContent = `旧闸${open ? '已打开' : '已关闭'} · 今晚预计淹到 ${wetRice} 格海稻田`;
}

const toggleGate = () => {
  map[gateY][gateX] = map[gateY][gateX] === 'G' ? 'X' : 'G';
  draw(ctx);
};

gate.addEventListener('click', toggleGate);
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * canvas.width / rect.width / size);
  const y = Math.floor((event.clientY - rect.top) * canvas.height / rect.height / size);
  if (x === gateX && y === gateY) toggleGate();
});
draw(ctx);
