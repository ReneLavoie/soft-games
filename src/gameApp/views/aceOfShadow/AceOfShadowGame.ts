import { AssetManager } from "../../../AssetManager";
import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import { Application } from "../../../Application";
import { GameBtn } from "../home/GameBtn";
import { CardDeckManager } from "./CardDeckManager";
import { Card } from "./Card";

export class AceOfShadowGame extends BaseView {

    private backSprite: PIXI.Sprite | null;

    private cardTexture: PIXI.Texture;

    private deckManager: CardDeckManager;

    private homeBtn: GameBtn;

    private intervalId: NodeJS.Timer;

    constructor(id: string) {
        super(id);
    }

    public async show(force: boolean = false) {
        await AssetManager.instance.loadAssetBundle(this.id);

        super.show();
    }

    protected onResize(e: any) {
        super.onResize(e);
    }

    private createHomeBtn() {
        this.homeBtn = new GameBtn(0xFFA500, 'Home', 'home');
        this.homeBtn.x = Application.windowSizes.width * 0.8;
        this.homeBtn.y = Application.windowSizes.height * 0.05;
        this.homeBtn.show();
        this.addChild(this.homeBtn);
    }

    private cardDeckManager() {
        const TOTAL_CARD : number = 144;
        const DECK_SIZE : number = 3;
        this.deckManager = new CardDeckManager(DECK_SIZE);
        
        this.addChild(this.deckManager);

        this.deckManager.y = Application.windowSizes.height * 0.3;

        for (let i = 0; i < TOTAL_CARD; i++) {
            const card = new Card(this.cardTexture);
            this.deckManager.addCardToDeck(card, i % 3); // Distribute cards among decks
        }

        this.startMovementAnimationCycle();
    }

    private startMovementAnimationCycle() {
        this.intervalId = setInterval(() => this.deckManager.moveTopCardRandomly(), 1000);
    }

    protected async onBundleLoaded(e: any) {
        if (e.id !== this.id) return;

        const texture: PIXI.Texture = await AssetManager.instance.getAsset("background_aos");
        this.backSprite = new PIXI.Sprite(texture);
        this.backSprite.width = Application.windowSizes.width;
        this.backSprite.height = Application.windowSizes.height;
        this.backSprite.x = (Application.windowSizes.width - this.backSprite.width) * 0.5;

        this.cardTexture = await AssetManager.instance.getAsset("card");

        this.addChild(this.backSprite);
    }

    protected onHideEnd() {

        clearInterval(this.intervalId);

        this.backSprite?.destroy();
        this.backSprite = null;

        this.homeBtn?.destroy();
        this.homeBtn = null;

        this.deckManager?.destroy();
        this.deckManager = null;

        AssetManager.instance.unloadAssetBundle(this.id);
    }

    protected onShowEnd() {
        super.onShowEnd();

        this.createHomeBtn();
        this.cardDeckManager();
    }
}