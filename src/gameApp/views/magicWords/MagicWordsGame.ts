import { AssetManager } from "../../../AssetManager";
import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import { Application } from "../../../Application";
import { GameBtn } from "../home/GameBtn";
import { TextGenerator } from "./TextGenerator";

// List of random words
const words = [
    'Hello', 'World', 'PixiJS', 'TypeScript', 'Graphics',
    'Image', 'Text', 'Random', 'Fun', 'Code'
];

export class MagicWordsGame extends BaseView {

    private backSprite: PIXI.Sprite | null;

    private textGenerator: TextGenerator; 

    private imageTexture: Array<PIXI.Texture> = [];

    private homeBtn: GameBtn;

    private currentText: PIXI.Container;

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

    private startTextGenerator() {
       
        this.currentText?.destroy({baseTexture: false, children: true});
         
        this.currentText = this.textGenerator.generate();

        this.currentText.x = (Application.windowSizes.width - this.currentText.width) * 0.5;
        this.currentText.y = Application.windowSizes.height * 0.88;

        this.addChild(this.currentText);
    }

    private createTextGenerator() {
        this.textGenerator = new TextGenerator(words, this.imageTexture);
        this.intervalId = setInterval(() => this.startTextGenerator(), 2000);
        this.startTextGenerator();
    }

    protected async onBundleLoaded(e: any) {
        if (e.id !== this.id) return;

        const texture: PIXI.Texture = await AssetManager.instance.getAsset("background_mw");
        this.backSprite = new PIXI.Sprite(texture);
        this.backSprite.width = Application.windowSizes.width;
        this.backSprite.height = Application.windowSizes.height;
        this.backSprite.x = (Application.windowSizes.width - this.backSprite.width) * 0.5;

        for(let i = 0; i < 4; i++) {
            const texture: PIXI.Texture = await AssetManager.instance.getAsset("icon_" + i);
            this.imageTexture.push(texture);
        }

        this.addChild(this.backSprite);
    }

    protected onHideEnd() {

        this.backSprite?.destroy();
        this.backSprite = null;

        clearInterval(this.intervalId);
        this.textGenerator = null;
        this.imageTexture = [];

        this.homeBtn?.destroy();

        this.currentText?.destroy({baseTexture: false, children: true});

        AssetManager.instance.unloadAssetBundle(this.id);
    }

    protected onShowEnd() {
        super.onShowEnd();

        this.createHomeBtn();
        
        this.createTextGenerator();
        
    }
}