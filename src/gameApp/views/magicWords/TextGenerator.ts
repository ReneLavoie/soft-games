import * as PIXI from 'pixi.js';
import { Application } from '../../../Application';
import { MathUtils } from '../../../utils/MathUtils';

export class TextGenerator {

    private words: string[];
    private images: PIXI.Texture[];

    constructor(words: string[], images: PIXI.Texture[]) {
        this.words = words;
        this.images = images;
    }

    public generate(): PIXI.Container {
        const container = new PIXI.Container();

        // Ensure there is at least one text and one image
        const elements: ('text' | 'image')[] = [];

        // Determine total number of elements (between 4 and 8)
        const numElements = Math.floor(Math.random() * 5) + 4;

        // Ensure at least one text and one image
        elements.push('text', 'image');

        // Fill the rest randomly
        for (let i = 2; i < numElements; i++) {
            elements.push(Math.random() < 0.5 ? 'text' : 'image');
        }

        // Shuffle elements array
        elements.sort(() => Math.random() - 0.5);

        let xPosition = 0;
        const elementHeights: number[] = [];

        const fontSize = Math.floor(Math.random() * (Application.windowSizes.width * 0.03)) + 20; 
        const maxSize = Application.windowSizes.width * 0.05;
        const minSize = Application.windowSizes.width * 0.02;
        const imageSize = MathUtils.randomInRange(minSize, maxSize);
        for (const elementType of elements) {
            if (elementType === 'text') {
                // Create a random text
                const word = this.words[Math.floor(Math.random() * this.words.length)];
                const textStyle = new PIXI.TextStyle({
                    fontSize: fontSize,
                    fill: 0xffffff * Math.random(), // Random color
                });
                const text = new PIXI.Text(word, textStyle);

                // Position the text
                text.x = xPosition;
                container.addChild(text);
                xPosition += text.width + 10; // Add spacing

                elementHeights.push(text.height);
            } else if (elementType === 'image') {
                // Create a random image
                if (this.images.length > 0) {
                    const texture = this.images[Math.floor(Math.random() * this.images.length)];
                    const sprite = new PIXI.Sprite(texture);
                    sprite.width = imageSize;
                    sprite.scale.y = sprite.scale.x;

                    // Position the sprite
                    sprite.x = xPosition;
                    container.addChild(sprite);
                    xPosition += sprite.width + 10; // Add spacing

                    elementHeights.push(sprite.height);
                }
            }
        }

        // Vertically align images and text
        const maxHeight = Math.max(...elementHeights);

        for (const child of container.children) {
            child.y = (maxHeight - (child as PIXI.Container).height) / 2;
        }

        return container;
    }

}

