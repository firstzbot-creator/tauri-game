export type DiscoveryState = {
  discoveredIds: Set<string>;
  count: number;
};

export function createDiscoveryState(): DiscoveryState {
  return {
    discoveredIds: new Set(),
    count: 0,
  };
}

export function recordDiscovery(state: DiscoveryState, objectId: string): DiscoveryState {
  if (state.discoveredIds.has(objectId)) {
    return state;
  }
  const newIds = new Set(state.discoveredIds);
  newIds.add(objectId);
  return {
    discoveredIds: newIds,
    count: state.count + 1,
  };
}

export function isDiscovered(state: DiscoveryState, objectId: string): boolean {
  return state.discoveredIds.has(objectId);
}

export function renderDiscoveryCounter(container: HTMLElement, count: number): void {
  let counter = container.querySelector<HTMLElement>('.discovery-counter');
  if (counter === null) {
    counter = document.createElement('div');
    counter.className = 'discovery-counter';
    counter.style.position = 'absolute';
    counter.style.top = '8px';
    counter.style.left = '8px';
    counter.style.zIndex = '100';
    counter.style.background = 'rgba(0, 0, 0, 0.3)';
    counter.style.borderRadius = '16px';
    counter.style.padding = '4px 12px';
    counter.style.color = 'white';
    counter.style.fontSize = '16px';
    counter.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
    container.appendChild(counter);
  }
  counter.textContent = `\u{1F43E} ${count}`;
}
