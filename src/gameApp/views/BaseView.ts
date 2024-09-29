import * as PIXI from 'pixi.js';
import { Application } from '../../Application';
import gsap from 'gsap';
import { EventDispatcher } from '../../EventDispatcher';
import { SystemEvents } from '../../events/Events';
import { Events } from '../events/Events';

export abstract class BaseView extends PIXI.Container {

    protected background: PIXI.Graphics;
    private _id: string;

    /**
     * Constructor for the BaseView class.
     * Initializes the view with a given ID.
     * @param {string} id - The ID of the view.
     */
    constructor(id: string) {
        super();
        this._id = id;
        this.init();
    }

    /**
     * Getter for the view's ID.
     * @returns {string} The ID of the view.
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Shows the view with an animation. If `force` is true, the view is shown instantly.
     * @param {boolean} [force=false] - Whether to show the view instantly without animation.
     * @returns {Promise<void>} A promise that resolves when the view is shown.
     */
    public async show(force: boolean = false): Promise<void> {
        this.visible = true;

        if (force) {
            this.y = 0;
            return;
        }

        this.y = Application.windowSizes.height;
        gsap.to(this, { 
            duration: 1, 
            ease: "power2.out", 
            y: 0,
            onComplete: this.onShowEnd,
            callbackScope: this
        });
    }

    /**
     * Hides the view with an animation, then calls the `onHideEnd` method.
     */
    public hide() {
        gsap.to(this, {
            duration: 1,
            ease: "power2.out",
            y: -Application.windowSizes.height,
            onComplete: () => {
                this.visible = false;
                this.onHideEnd();}
        });
    }

    /**
     * Initializes the view by setting up event listeners and setting the view to be invisible initially.
     * @protected
     */
    protected init() {
        EventDispatcher.instance.dispatcher.on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
        EventDispatcher.instance.dispatcher.on(SystemEvents.BUNDLE_LOADED, this.onBundleLoaded, this);
        this.visible = false;
    }

    /**
     * Handles window resize events.
     * Placeholder function to be implemented by subclasses.
     * @param {any} e - The resize event.
     * @protected
     */
    protected onResize(e: any) {}

    /**
     * Called when the view's show animation completes.
     * Dispatches a PAGE_SHOWN event.
     * @protected
     */
    protected onShowEnd() {
        EventDispatcher.instance.dispatcher.emit(Events.PAGE_SHOWN);
    }

    /**
     * Called when the asset bundle is loaded.
     * Placeholder function to be implemented by subclasses.
     * @param {any} e - The event data for the bundle loaded event.
     * @protected
     * @returns {Promise<void>}
     */
    protected async onBundleLoaded(e: any) {}

    /**
     * Called when the view's hide animation completes.
     * Placeholder function to be implemented by subclasses.
     * @protected
     */
    protected onHideEnd() {}
}