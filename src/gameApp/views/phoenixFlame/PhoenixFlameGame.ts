import { AssetManager } from "../../../AssetManager";
import { BaseView } from "../BaseView";
import * as PIXI from 'pixi.js';
import { Application } from "../../../Application";
import { GameBtn } from "../home/GameBtn";
import { FireFilter } from "./FireFilter";

export class PhoenixFlameGame extends BaseView {

    private backSprite: PIXI.Sprite | null;

    private homeBtn: GameBtn;

    private fireFilter: FireFilter;

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

    private createFireFilter() {
        const targetWidth = Application.windowSizes.width;
        const targetHeight = Application.windowSizes.height;
        this.fireFilter = new FireFilter(targetWidth, targetHeight);

        this.backSprite.filters = [this.fireFilter];
    }

    protected async onBundleLoaded(e: any) {
        if (e.id !== this.id) return;

        const texture: PIXI.Texture = await AssetManager.instance.getAsset("background_pf");
        this.backSprite = new PIXI.Sprite(texture);
        this.backSprite.width = Application.windowSizes.width;
        this.backSprite.height = Application.windowSizes.height;
        this.backSprite.x = (Application.windowSizes.width - this.backSprite.width) * 0.5;

        this.addChild(this.backSprite);
    }

    protected onHideEnd() {

        if(this.backSprite) {
            this.backSprite.filters = [];
        }

        Application.app.ticker.remove(this.onShaderUpdate, this);
        
        this.backSprite?.destroy();
        this.backSprite = null;

        this.homeBtn?.destroy();
        this.homeBtn = null;

        this.fireFilter?.destroy();
        this.fireFilter = null;

        AssetManager.instance.unloadAssetBundle(this.id);
    }

    protected onShowEnd() {
        super.onShowEnd();

        this.createHomeBtn();
        this.createFireFilter();

        Application.app.ticker.add(this.onShaderUpdate, this);
    }

    private onShaderUpdate(delta: number) {
        this.fireFilter.update(delta);
    }
}