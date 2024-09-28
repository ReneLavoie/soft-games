import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { EventDispatcher } from '../EventDispatcher';
import { SystemEvents } from '../events/Events';

export abstract class BaseUIComponent extends PIXI.Container {

    protected background: PIXI.Graphics;

    constructor() {
        super();
    }

    public destroy() {
        super.destroy();
       
        this.background?.destroy();
    }

    public show() {
        if (this.visible) return;

        this.visible = true;
        gsap.to(this, { duration: 0.3, alpha: 1 });
    }

    public hide() {
        if (!this.visible) return;

        this.visible = false;
    }

    protected init() {
        this.visible = false;
        this.alpha = 0;
        this.createBackground();

        EventDispatcher.instance.dispatcher.on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
    }

    protected createBackground() { }

    protected onResize(e: any) { } 

}


