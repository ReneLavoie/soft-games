import * as PIXI from 'pixi.js';
import { Application } from '../../../Application';

export class Card extends PIXI.Sprite {

  constructor(texture: PIXI.Texture) {
    super(texture);
    this.anchor.set(0.5); 
    this.width = Application.windowSizes.width * 0.1;
    this.scale.y = this.scale.x;
  }
}