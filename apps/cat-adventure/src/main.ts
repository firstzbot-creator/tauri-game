import { updatePosition, type CatState } from './state.js';
import { saveGameState, loadGameState } from './ipc.js';


async function init() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = `
    <div style="font-family: sans-serif; text-align: center; padding: 20px;">
      <h1>Cat Adventure 🐾</h1>
      <div id="cat" style="font-size: 50px; transition: transform 0.2s;">🐱</div>
      <p>Use keys or buttons to move your cat wizard!</p>
      <div style="margin-top: 20px;">
        <button id="up">UP</button><br>
        <button id="left">LEFT</button>
        <button id="right">RIGHT</button><br>
        <button id="down">DOWN</button>
      </div>
      <div style="margin-top: 20px;">
        <button id="save">Save State</button>
        <button id="load">Load State</button>
      </div>
      <pre id="status" style="margin-top: 20px; color: #666;"></pre>
    </div>
  `;

  let state: CatState = {
    position: { x: 5, y: 5 },
    equippedHat: 'wizard'
  };

  const cat = document.querySelector<HTMLDivElement>('#cat')!;
  const status = document.querySelector<HTMLPreElement>('#status')!;

  function updateUI() {
    cat.style.transform = `translate(${state.position.x * 20 - 100}px, ${state.position.y * 20 - 100}px)`;
    status.textContent = JSON.stringify(state, null, 2);
  }

  const move = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    state = updatePosition(state, dir);
    updateUI();
  };

  document.getElementById('up')?.addEventListener('click', () => move('UP'));
  document.getElementById('down')?.addEventListener('click', () => move('DOWN'));
  document.getElementById('left')?.addEventListener('click', () => move('LEFT'));
  document.getElementById('right')?.addEventListener('click', () => move('RIGHT'));

  document.getElementById('save')?.addEventListener('click', async () => {
    const res = await saveGameState({ gameId: 'cat-adventure', state });
    if (res.ok) alert('Saved!'); else alert('Fail: ' + res.error.message);
  });

  document.getElementById('load')?.addEventListener('click', async () => {
    const res = await loadGameState({ gameId: 'cat-adventure' });
    if (res.ok) {
        state = res.value;
        updateUI();
        alert('Loaded!');
    } else alert('Fail: ' + res.error.message);
  });

  updateUI();
}

init().catch(console.error);
