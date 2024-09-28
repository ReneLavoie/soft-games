import * as PIXI from 'pixi.js';
import { BaseSiteApp } from "./gameApp/BaseSiteApp";
import { GameApp } from "./gameApp/GameApp";
import { SystemEvents, TotalHeap } from "./events/Events";
import { EventDispatcher } from "./EventDispatcher";
import { MathUtils } from "./utils/MathUtils";

type WindowSize = {
    width: number;
    height: number;
}

export class Application extends PIXI.Application {

    private static _app: Application;
    private mainContainer: PIXI.Container;

    private pageApp: BaseSiteApp;

    private resizeTimeoutId: NodeJS.Timeout;

    constructor() {
        super(Application.getAppOptions());
        this.init();
    }

    public static get app(): Application {
        return this._app;
    }

    public static get windowSizes(): WindowSize {
        return {
            width: window.visualViewport.width,
            height: window.visualViewport.height
        }
    }

    private init() {
        Application._app = this;
        (globalThis as any).__PIXI_APP__ = this;
        this.mainContainer = new PIXI.Container();

        window.onresize = this.onResize.bind(this);
        window.onload = async () => {
            const gameContainer: HTMLElement = document.getElementById("gameContainer") as HTMLElement;
            gameContainer.appendChild(this.view as HTMLCanvasElement);
            this.stage.addChild(this.mainContainer);

            this.createApp();

            (this.view as HTMLCanvasElement).style.position = 'absolute';
            (this.view as HTMLCanvasElement).style.left = '50%';
            (this.view as HTMLCanvasElement).style.top = '50%';
            (this.view as HTMLCanvasElement).style.transform = 'translate3d( -50%, -50%, 0 )';
        };
    }

    private createApp() {
        this.pageApp = new GameApp();
        this.mainContainer.addChild(this.pageApp);
    }

    private static getAppOptions() {
        return {
            backgroundColor: 0x2b2b2a,
            width: this.windowSizes.width,
            height: this.windowSizes.height,
            antialias: true,
            autoDensity: true,
            resolution: 3,
        }
    }

    private onResize() {

        clearTimeout(this.resizeTimeoutId);

        this.resizeTimeoutId = setTimeout(() => {
            this.renderer.resize(Application.windowSizes.width, Application.windowSizes.height);
            EventDispatcher.instance.dispatcher.emit(SystemEvents.WINDOW_RESIZE);
        }, 200);
    }
}