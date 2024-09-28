import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import { AssetManager } from "../../../AssetManager";
import { Application } from "../../../Application";
import { GameBtn } from './GameBtn';
import { EventDispatcher } from "../../../EventDispatcher";
import { Events } from "../../events/Events";

export class HomeView extends BaseView {

    private backSprite: PIXI.Sprite | null;

    private aceOfShadowBtn: GameBtn;
    private magicWordsBtn: GameBtn;
    private phoenixFlameBtn: GameBtn;

    private btnsContainer: PIXI.Container;

    constructor(id: string) {
        super(id);
    }

    public async show(force: boolean = false) {
        await AssetManager.instance.loadAssetBundle(this.id);
        
        super.show();
    }

    protected init() {
        super.init();

        
    }

    private createButtons() {
        this.btnsContainer = new PIXI.Container();

        this.aceOfShadowBtn = new GameBtn(0xFFA500, 'Ace of Shadow', 'ace_of_shadows');
        this.magicWordsBtn = new GameBtn(0xE6E6FA, 'Magic Words', 'magic_words');
        this.phoenixFlameBtn = new GameBtn(0xFF4500, 'Phoenix Flame', 'phoenix_flame');

        this.btnsContainer.addChild(this.aceOfShadowBtn);
        this.btnsContainer.addChild(this.magicWordsBtn);
        this.btnsContainer.addChild(this.phoenixFlameBtn);

        this.addChild(this.btnsContainer);
    }

    private showButtons() {
        this.aceOfShadowBtn.show();
        this.magicWordsBtn.show();
        this.phoenixFlameBtn.show();
    }

    private positionButtons() {
        for(let i = 0; i < this.btnsContainer.children.length; i++) {
            const btn = this.btnsContainer.children[i] as PIXI.Container;
            const offset = 20;
            btn.x = i * (btn.width + offset);
        }

        this.btnsContainer.x = (Application.windowSizes.width - this.btnsContainer.width) * 0.5;
        this.btnsContainer.y = (Application.windowSizes.height - this.btnsContainer.height) * 0.5;
    }

    protected onResize(e: any) {
        super.onResize(e);
    }

    protected async onBundleLoaded(e: any) {
        if (e.id !== this.id) return;

        const texture: PIXI.Texture = await AssetManager.instance.getAsset("background_home");
        this.backSprite = new PIXI.Sprite(texture);
        this.backSprite.width = Application.windowSizes.width;
        this.backSprite.height = Application.windowSizes.height;
        this.backSprite.x = (Application.windowSizes.width - this.backSprite.width) * 0.5;

        this.addChild(this.backSprite);
    }

    protected onShowEnd() {
       super.onShowEnd();

       this.createButtons();
       this.showButtons();
       this.positionButtons();
    }

    protected onHideEnd() {
        if (this.backSprite) {
            this.backSprite.destroy();
            this.backSprite = null;
        }

        this.btnsContainer.destroy({baseTexture: false, children: true});
        AssetManager.instance.unloadAssetBundle(this.id);
    }
}