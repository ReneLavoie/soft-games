import { Application } from '../../../Application';
import { BaseButton } from '../../../ui/BaseButton';
import * as PIXI from 'pixi.js';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { EventDispatcher } from '../../../EventDispatcher';
import { Events } from '../../events/Events';

export class GameBtn extends BaseButton {

    private text: PIXI.Text;

    private viewId: string;

    private backgroundColor: number;
    private label: string;

    constructor(backgroundColor: number, label: string, viewId: string) {
        super();
        this.backgroundColor = backgroundColor;
        this.label = label;
        this.viewId = viewId;
        this.init();
    }

    public destroy() {
        super.destroy();

        this.text?.destroy();
    }

    protected createBackground() { 
        const targetWidth = Application.windowSizes.width * 0.15;
        const targetHeight = Application.windowSizes.height * 0.05;
        this.background = new PIXI.Graphics();
        this.background.beginFill(this.backgroundColor);
        this.background.drawRoundedRect(0, 0, targetWidth, targetHeight, 10);
        this.background.endFill();

        const dropShadowFilter = new DropShadowFilter({
            color: 0x000000, 
            alpha: 0.6,     
            blur: 4,         
            distance: 5,     
            rotation: 45,   
            quality: 5      
        });
        
        this.background.filters = [dropShadowFilter];

        this.addChild(this.background);
    }

    private createText() {
        const fontSize = this.background.width * 0.11;
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: fontSize,
            fontWeight: 'bold',
            fill: '#333333',
            align: 'center',
        });

        this.text = new PIXI.Text(this.label, style);
        this.text.anchor.set(0.5);
        this.text.x = this.background.width / 2;
        this.text.y = this.background.height / 2;

        this.addChild(this.text);
    }

    protected init() {
        super.init();

        this.createText();
    }

    protected onDown(e:  PIXI.FederatedMouseEvent) {
        this.x += 2;
        this.y += 2;
    }

    protected onUp(e:  PIXI.FederatedMouseEvent) {
        this.x -= 2;
        this.y -= 2;

        EventDispatcher.instance.dispatcher.emit(Events.SHOW_PAGE, this.viewId);
    }

    protected onUpOutside(e:  PIXI.FederatedMouseEvent) {
        this.x -= 2;
        this.y -= 2;
    }
}