import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { EventDispatcher } from '../EventDispatcher';
import { SystemEvents } from '../events/Events';

export abstract class BaseUIComponent extends PIXI.Container {

    protected background: PIXI.Graphics;

     /**
     * Constructor for the BaseUIComponent class.
     * Initializes the PIXI.Container.
     */
    constructor() {
        super();
    }

    /**
     * Destroys the UI component and its background.
     * Calls the PIXI.Container's destroy method and destroys the background if it exists.
     */
    public destroy() {
        super.destroy();
       
        this.background?.destroy();
    }

    /**
     * Shows the UI component by setting its visibility to true.
     * If it's already visible, the function returns early.
     */
    public show() {
        if (this.visible) return;

        this.visible = true;
        gsap.to(this, { duration: 0.3, alpha: 1 });
    }

    /**
     * Hides the UI component by setting its visibility to false.
     * If it's already hidden, the function returns early.
     */
    public hide() {
        if (!this.visible) return;

        this.visible = false;
    }

    /**
     * Initializes the component's visibility and alpha.
     * Sets up a listener for window resize events.
     * @protected
     */
    protected init() {
        this.visible = false;
        this.alpha = 0;
        this.createBackground();

        EventDispatcher.instance.dispatcher.on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
    }

     /**
     * Creates the background for the UI component.
     * Placeholder function to be implemented by subclasses.
     * @protected
     */
    protected createBackground() { }

    /**
     * Handles window resize events.
     * Placeholder function to be implemented by subclasses.
     * @param {any} e - The resize event.
     * @protected
     */
    protected onResize(e: any) { } 

}


