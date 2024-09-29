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

    /**
     * Private constructor to prevent direct instantiation.
     * Sets up the application and adds the main container.
     * @private
     */
    constructor() {
        super(Application.getAppOptions());
        this.init();
    }

    /**
     * Returns the singleton instance of the application.
     * @returns {Application} The singleton application instance.
     */
    public static get app(): Application {
        return this._app;
    }

    /**
     * Retrieves the current window size dimensions.
     * @returns {WindowSize} The current width and height of the window.
     */
    public static get windowSizes(): WindowSize {
        return {
            width: window.visualViewport.width,
            height: window.visualViewport.height
        }
    }

    /**
     * Initializes the application by setting up the main container and event listeners.
     * @private
     */
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

    /**
     * Creates and adds the game application to the main container.
     * @private
     */
    private createApp() {
        this.pageApp = new GameApp();
        this.mainContainer.addChild(this.pageApp);
    }

    /**
     * Returns the options used to configure the PIXI application.
     * @private
     * @returns {object} The configuration options for the PIXI application.
     */
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

    /**
     * Handles window resize events and resizes the application accordingly.
     * The resize event is debounced to prevent excessive calls.
     * @private
     */
    private onResize() {

        clearTimeout(this.resizeTimeoutId);

        this.resizeTimeoutId = setTimeout(() => {
            this.renderer.resize(Application.windowSizes.width, Application.windowSizes.height);
            EventDispatcher.instance.dispatcher.emit(SystemEvents.WINDOW_RESIZE);
        }, 200);
    }
}