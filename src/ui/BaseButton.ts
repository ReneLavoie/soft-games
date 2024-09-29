import { BaseUIComponent } from './BaseUIComponent';
import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';

export abstract class BaseButton extends BaseUIComponent {


    /**
     * Constructor for the BaseButton class.
     * Calls the constructor of the BaseUIComponent class.
     */
    constructor() {
        super();

    }

    /**
     * Enables the button, making it interactive and setting its alpha to 1 with an animation.
     * Uses GSAP to animate the button's alpha.
     */
    public enable() {
        this.interactive = true;
        gsap.killTweensOf(this);
        gsap.to(this, {alpha: 1, duration: 0.3});
    }

    /**
     * Disables the button, making it non-interactive and reducing its alpha to 0.6 with an animation.
     * Uses GSAP to animate the button's alpha.
     */
    public disable() {
        this.interactive = false;
        gsap.killTweensOf(this);
        gsap.to(this, {alpha: 0.6, duration: 0.3});
    }

    /**
     * Destroys the button and removes all event listeners.
     * Calls the destroy method of the BaseUIComponent class.
     */
    public destroy() {
        super.destroy();

        this.off('pointerdown', this.onDown, this);
        this.off('pointerup', this.onUp, this);
        this.off('pointerupoutside', this.onUpOutside, this);
        this.off('pointerover', this.onOver, this);
        this.off('pointerout', this.onOut, this);
    }

    /**
     * Initializes the button by setting it as interactive and adding pointer event listeners.
     * Calls the init method of the BaseUIComponent class.
     * @protected
     */
    protected init() {
        super.init();
        this.interactive = true;

        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointerupoutside', this.onUpOutside, this);
        this.on('pointerover', this.onOver, this);
        this.on('pointerout', this.onOut, this);
    }

    /**
     * Handles the pointerdown event for the button.
     * Placeholder function to be implemented by subclasses.
     * @param {PIXI.FederatedMouseEvent} e - The mouse event.
     * @protected
     */
    protected onDown(e:  PIXI.FederatedMouseEvent) {}

     /**
     * Handles the pointerup event for the button.
     * Placeholder function to be implemented by subclasses.
     * @param {PIXI.FederatedMouseEvent} e - The mouse event.
     * @protected
     */
    protected onUp(e:  PIXI.FederatedMouseEvent) {}

    /**
     * Handles the pointerupoutside event for the button.
     * Placeholder function to be implemented by subclasses.
     * @param {PIXI.FederatedMouseEvent} e - The mouse event.
     * @protected
     */
    protected onUpOutside(e:  PIXI.FederatedMouseEvent) {}

    /**
     * Handles the pointerover event for the button.
     * Placeholder function to be implemented by subclasses.
     * @param {PIXI.FederatedMouseEvent} e - The mouse event.
     * @protected
     */
    protected onOver(e:  PIXI.FederatedMouseEvent) {}

    /**
     * Handles the pointerout event for the button.
     * Placeholder function to be implemented by subclasses.
     * @param {PIXI.FederatedMouseEvent} e - The mouse event.
     * @protected
     */
    protected onOut(e:  PIXI.FederatedMouseEvent) {}

}