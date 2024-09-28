import { CardDeck } from './CardDeck';
import { Card } from './Card';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { Application } from '../../../Application';

export class CardDeckManager extends PIXI.Container {

    private decks: CardDeck[] = [];

    private tween: gsap.core.Tween;

    constructor(deckCount: number) {
        super();
        this.createDecks(deckCount);
    }

    public destroy() {
        super.destroy();

        this.decks.forEach(d => d.destroy());
        this.tween?.kill();
    }

    private createDecks(count: number) {
        const spacing = Application.windowSizes.width / (count + 1);
        for (let i = 0; i < count; i++) {
            const deck = new CardDeck();
            deck.position.set(spacing * (i + 1), Application.windowSizes.height / 2);
            this.decks.push(deck);
            this.addChild(deck);
        }
    }

    public addCardToDeck(card: Card, deckIndex: number) {
        this.decks[deckIndex].addCard(card);
    }

    public moveTopCardRandomly() {
        const sourceDecks = this.decks.filter(deck => deck.getCardCount() > 0);
        if (sourceDecks.length <= 1) return; // Need at least two decks with cards

        let attempts = 0;
        const maxAttempts = 10;
        let moved = false;

        while (!moved && attempts < maxAttempts) {
            attempts++;

            const fromDeck = sourceDecks[Math.floor(Math.random() * sourceDecks.length)];
            const destinationDecks = this.decks.filter(deck => deck !== fromDeck);
            const toDeck = destinationDecks[Math.floor(Math.random() * destinationDecks.length)];

            // Ensure that fromDeck and toDeck are not the same
            if (fromDeck !== toDeck) {
                const card = fromDeck.removeCard();
                if (card)  {
                    // Get card's position relative to fromDeck
                    const cardPositionInFromDeck = card.position.clone(); // in fromDeck coordinate system

                    // Compute card's position relative to CardDeckManager
                    const fromDeckPosition = fromDeck.position;
                    const cardPositionInManager = new PIXI.Point(
                        fromDeckPosition.x + cardPositionInFromDeck.x,
                        fromDeckPosition.y + cardPositionInFromDeck.y
                    );

                    // Remove card from fromDeck and add to manager
                    card.position.set(cardPositionInManager.x, cardPositionInManager.y);
                    this.addChild(card);

                    // Compute target position in manager's coordinate system
                    const toDeckPosition = toDeck.position;
                    const targetPositionInToDeck = new PIXI.Point(0, -toDeck.getCardCount() * 5); // Position in toDeck
                    const targetPositionInManager = new PIXI.Point(
                        toDeckPosition.x + targetPositionInToDeck.x,
                        toDeckPosition.y + targetPositionInToDeck.y
                    );

                    this.tween = gsap.to(card.position, {
                        duration: 2,
                        x: targetPositionInManager.x,
                        y: targetPositionInManager.y,
                        onComplete: () => {
                            // Remove card from manager and add to toDeck
                            this.removeChild(card);
                            // Adjust card's position to be relative to toDeck
                            card.position.set(targetPositionInToDeck.x, targetPositionInToDeck.y);
                            toDeck.addCard(card);
                        },
                        ease: 'power1.inOut',
                    });

                    moved = true; // Indicate that the card has been moved
                }
            }
        }
    }
}
