import * as PIXI from 'pixi.js';
import { BaseView } from '../gameApp/views/BaseView';
import { EventDispatcher } from '../EventDispatcher';
import { Events } from './events/Events';

export class PageManager extends PIXI.Container {

    private pages: Array<BaseView> = [];
    private currentPageId: string;

     /**
     * Constructor for the PageManager class.
     * Initializes the PIXI.Container.
     */
    constructor() {
        super();
    }

    /**
     * Retrieves the ID of the current page.
     * @returns {string} The current page's ID.
     */
    public getCurrentPageId(): string {
        return this.currentPageId;
    }

    /**
     * Shows the specified page by its ID.
     * If the page is already shown, an event is dispatched and the function returns.
     * Hide the current page if it exists.
     * @param {string} pageId - The ID of the page to show.
     */
    public showPage(pageId: string) {

        if (this.currentPageId === pageId) {
            EventDispatcher.instance.dispatcher.emit(Events.PAGE_SHOWN);
            return;
        }

        let page;
        if (this.currentPageId && this.currentPageId !== "") {
            page = this.pages.find(p => p.id === this.currentPageId);
            page.hide();
        }

        page = this.pages.find(p => p.id === pageId);

        if (page) {
            page.show();
            this.currentPageId = pageId;
        }
    }

    /**
     * Adds a new page to the PageManager.
     * The page is added to the internal pages array and to the display list.
     * @param {BaseView} page - The page to add.
     */
    public addPage(page: BaseView) {
        this.pages.push(page);
        this.addChild(page);
    }

}