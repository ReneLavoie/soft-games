import * as PIXI from 'pixi.js';
import { Application } from '../Application';

export class FPSCounter extends PIXI.Container {

    private fpsText: PIXI.Text;
    private background: PIXI.Graphics;

    private frameCount: number = 0;
    private lastTime: number = 0;

    /**
     * Constructor for the FPSCounter class.
     * Initializes the container and sets up the FPS counter display.
     */
    constructor() {
        super();
        this.init();
    }   

    /**
     * Initializes the FPS counter, setting up event listeners and creating the display elements.
     * @private
     */
    private init() {
        this.lastTime = performance.now();
        Application.app.ticker.add(this.onFPSUpdate, this);
        this.createBackground();
        this.createText();
    }

    /**
     * Creates the text object that displays the FPS value.
     * @private
     */
    private createText() {
        const fontSize = this.background.width * 0.2;
        this.fpsText = new PIXI.Text('FPS: 0', {
            fontSize: fontSize,
            fill: 0xffffff,
        });

        this.fpsText.anchor.set(0.5);

        this.fpsText.x = this.background.width * 0.5;
        this.fpsText.y = this.background.height * 0.5;

        this.addChild(this.fpsText);
    }

    /**
     * Creates the background for the FPS counter display.
     * @private
     */
    private createBackground() {
        const targetWidth = Application.windowSizes.width * 0.1;
        const targetHeight = Application.windowSizes.height * 0.05;
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000, 0.5);
        this.background.drawRoundedRect(0, 0, targetWidth, targetHeight, 10);
        this.background.endFill();
        this.addChild(this.background);
    }

    /**
     * Updates the FPS count every frame and adjusts the text accordingly.
     * The FPS value is updated once per second.
     * @private
     */
    private onFPSUpdate() {
        this.frameCount++;
        const currentTime = performance.now();
        const elapsedTime = currentTime - this.lastTime;

        if (elapsedTime >= 1000) { // Update the FPS every second
            const fps = Math.round((this.frameCount / elapsedTime) * 1000);
            this.fpsText.text = `FPS: ${fps}`; 
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }
}