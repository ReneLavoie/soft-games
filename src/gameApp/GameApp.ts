import { BaseSiteApp } from "./BaseSiteApp";
import { PageManager } from "./PageManager";
import { HomeView } from "./views/home/HomeView";
import { Events } from "./events/Events";
import { EventDispatcher } from "../EventDispatcher";
import { Application } from "../Application";
import { SystemEvents } from "../events/Events";
import { AssetManager } from "../AssetManager";
import { AceOfShadowGame } from "./views/aceOfShadow/AceOfShadowGame";
import { MagicWordsGame } from "./views/magicWords/MagicWordsGame";
import { PhoenixFlameGame } from "./views/phoenixFlame/PhoenixFlameGame";
import { FPSCounter } from "./FPSCounter";


export class GameApp extends BaseSiteApp {

    private pageManager: PageManager;
    private fpsCounter: FPSCounter;

    /**
     * Constructor for the GameApp class.
     * Initializes the BaseSiteApp.
     */
    constructor() {
        super();
    }

    /**
     * Initializes the game app by loading assets, setting up the page manager, 
     * creating game views, and adding event listeners.
     * @protected
     * @returns {Promise<void>} A promise that resolves when initialization is complete.
     */
    protected async init(): Promise<void> {

        await AssetManager.instance.init();
        this.pageManager = new PageManager();
        this.addChildAt(this.pageManager, 0);

        this.fpsCounter = new FPSCounter();
        this.fpsCounter.x = Application.windowSizes.width * 0.05;
        this.fpsCounter.y = Application.windowSizes.height * 0.05;
        this.addChild(this.fpsCounter);
      
        this.createGameViews();

        EventDispatcher.instance.dispatcher.on(SystemEvents.WINDOW_RESIZE, this.onResize, this);
        EventDispatcher.instance.dispatcher.on(Events.SHOW_PAGE, this.onShowPage, this);
    }

    /**
     * Creates and adds the various game views to the page manager.
     * @private
     */
    private createGameViews() {
        const homeView: HomeView = new HomeView("home");
        this.pageManager.addPage(homeView);
        this.pageManager.showPage("home");

        const aceOfShadowView: AceOfShadowGame = new AceOfShadowGame('ace_of_shadows');
        this.pageManager.addPage(aceOfShadowView);

        const magicWordsView: MagicWordsGame = new MagicWordsGame('magic_words');
        this.pageManager.addPage(magicWordsView);

        const phoenixFlameView: PhoenixFlameGame = new PhoenixFlameGame('phoenix_flame');
        this.pageManager.addPage(phoenixFlameView);
    }

    /**
     * Event handler for showing a specific page.
     * @private
     * @param {string} pageId - The ID of the page to show.
     */
    private onShowPage(pageId: string) {
        this.pageManager.showPage(pageId);
    }

    /**
     * Event handler for window resize events.
     * Updates the y-position of the page manager.
     * @private
     * @param {any} e - The resize event.
     */
    private onResize(e: any) {
        this.pageManager.y = Application.windowSizes.height * 0.1;
    }
}