import * as PIXI from 'pixi.js';
import { Application } from '../../../Application';

export class Card extends PIXI.Sprite {
/**
 * Creates a new Card instance.
 * @param texture The texture for the card.
 */
  constructor(texture: PIXI.Texture) {
    super(texture);
    this.anchor.set(0.5); 
    this.width = Application.windowSizes.width * 0.1;
    this.scale.y = this.scale.x;
  }
}