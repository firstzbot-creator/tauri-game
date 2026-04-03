import { describe, it, expect } from 'vitest';
import { createWanderingAnimals, updateAnimalPositions } from './animals.js';
import { FIELD_WIDTH, FIELD_HEIGHT } from './state.js';

describe('createWanderingAnimals', () => {
  it('returns requested count with valid positions', () => {
    const animals = createWanderingAnimals(3, FIELD_WIDTH, FIELD_HEIGHT);
    expect(animals).toHaveLength(3);
    for (const a of animals) {
      expect(a.position.x).toBeGreaterThanOrEqual(0);
      expect(a.position.x).toBeLessThanOrEqual(FIELD_WIDTH);
      expect(a.position.y).toBeGreaterThanOrEqual(0);
      expect(a.position.y).toBeLessThanOrEqual(FIELD_HEIGHT);
    }
  });

  it('each animal has a path with at least 3 waypoints', () => {
    const animals = createWanderingAnimals(2, FIELD_WIDTH, FIELD_HEIGHT);
    for (const a of animals) {
      expect(a.path.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('updateAnimalPositions', () => {
  it('moves animals toward their next waypoint', () => {
    const animals = createWanderingAnimals(1, FIELD_WIDTH, FIELD_HEIGHT);
    const initial = animals[0];
    if (initial === undefined) throw new Error('No animal created');
    // First update may just advance waypoint index (animal starts at waypoint 0)
    let updated = updateAnimalPositions(animals);
    // Second update moves toward waypoint 1
    updated = updateAnimalPositions(updated);
    const moved = updated[0];
    if (moved === undefined) throw new Error('No animal returned');
    // After two updates, currentWaypoint should have advanced
    expect(moved.currentWaypoint).not.toBe(initial.currentWaypoint);
  });

  it('wraps to first waypoint when reaching the last', () => {
    // Create animals and advance through all waypoints
    let animals = createWanderingAnimals(1, FIELD_WIDTH, FIELD_HEIGHT);
    const animal = animals[0];
    if (animal === undefined) throw new Error('No animal created');
    const numWaypoints = animal.path.length;

    // Force animal to last waypoint
    const lastWaypoint = animal.path[numWaypoints - 1];
    if (lastWaypoint === undefined) throw new Error('No last waypoint');
    animals = [{
      ...animal,
      position: { ...lastWaypoint },
      currentWaypoint: numWaypoints - 1,
    }];

    const updated = updateAnimalPositions(animals);
    const result = updated[0];
    if (result === undefined) throw new Error('No animal returned');
    // Should have wrapped to waypoint 0
    expect(result.currentWaypoint).toBe(0);
  });
});
