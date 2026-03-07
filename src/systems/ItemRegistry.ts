import { ItemType } from "../types";

export interface ItemDefinition {
  type: ItemType;
  spriteKey: string;
  scoreValue: number;
  isRequired: boolean;
}

const BUILT_IN_ITEMS: ItemDefinition[] = [
  { type: "star", spriteKey: "star", scoreValue: 100, isRequired: false },
  { type: "coin", spriteKey: "coin", scoreValue: 50, isRequired: false },
  { type: "key", spriteKey: "key", scoreValue: 0, isRequired: true },
];

export class ItemRegistry {
  private registry: Map<ItemType, ItemDefinition> = new Map();

  constructor() {
    for (const item of BUILT_IN_ITEMS) {
      this.registry.set(item.type, item);
    }
  }

  register(type: ItemType, definition: ItemDefinition): void {
    this.registry.set(type, definition);
  }

  getDefinition(type: ItemType): ItemDefinition | undefined {
    return this.registry.get(type);
  }

  getAllTypes(): ItemType[] {
    return [...this.registry.keys()];
  }
}
