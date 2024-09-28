import { Card } from './Card';
import * as PIXI from 'pixi.js';

export class CardDeck extends PIXI.Container {
  private cards: Card[] = [];

    constructor() {
        super();
    }

    public destroy() {
        super.destroy();

        this.cards.forEach(c => c.destroy());
        this.cards = [];
    }

    public addCard(card: Card) {
        this.cards.push(card);
        this.addChild(card);
        this.updateCardPositions();
    }

    public removeCard(): Card | undefined {
        const card = this.cards.pop();
        if (card) {
            this.removeChild(card);
            this.updateCardPositions();
        }
        return card;
    }

    public updateCardPositions() {
        const offset = 5;
        this.cards.forEach((card, index) => {
            card.position.set(0, -index * offset); // Slight offset for stacking effect
            card.zIndex = index;
        });
        this.sortChildren(); 
    }

    public getCardCount(): number {
        return this.cards.length;
    }
}
