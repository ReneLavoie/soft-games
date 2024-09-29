import * as PIXI from 'pixi.js';
/**
 * A singleton class that handles event dispatching using PIXI's EventEmitter.
 */
export class EventDispatcher {

    private static _instance: EventDispatcher;
    private _dispatcher: PIXI.utils.EventEmitter;

    /**
     * Private constructor to prevent direct instantiation.
     * Initializes the event dispatcher.
     * @private
     */
    private constructor() {
        this.init();
    }

    /**
     * Returns the singleton instance of EventDispatcher.
     * If it doesn't exist, creates a new instance.
     * @returns {EventDispatcher} The singleton instance of EventDispatcher.
     */
    public static get instance(): EventDispatcher {
        if (!this._instance) {
            this._instance = new EventDispatcher();
        }

        return this._instance;
    }

    /**
     * Returns the PIXI event emitter used by this class.
     * @returns {PIXI.utils.EventEmitter} The PIXI event emitter.
     */
    public get dispatcher(): PIXI.utils.EventEmitter {
        return this._dispatcher;
    }

    /**
     * Initializes the event dispatcher by creating a new PIXI event emitter.
     * @private
     */
    private init() {
        this._dispatcher = new PIXI.utils.EventEmitter();
    }
}