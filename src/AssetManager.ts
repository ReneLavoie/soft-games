
import * as PIXI from 'pixi.js';
import { Application } from './Application';
import { Assets } from '@pixi/assets';
import { EventDispatcher } from './EventDispatcher';
import { SystemEvents } from './events/Events';
import {ISkeletonData, Spine} from 'pixi-spine';
import { MathUtils } from './utils/MathUtils';

export class AssetManager {

    private static _instance: AssetManager;
    private bundles: Map<string, object>;

    /**
     * Private constructor to prevent direct instantiation.
     * Initializes an empty bundles map.
     * @private
     */
    private constructor() {}

    /**
     * Initializes the asset manager and loads assets.
     * Dispatches an event when assets are loaded.
     * @returns {Promise<void>} A promise that resolves when the initialization is complete.
     */
    public async init():Promise<void>  {
        await this.initAssetManager();
        this.bundles = new Map();
    }

    /**
     * Returns the singleton instance of AssetManager.
     * If it doesn't exist, creates a new instance.
     * @returns {AssetManager} The singleton instance of AssetManager.
     */
    public static get instance(): AssetManager {
        if(!this._instance) {
            this._instance = new AssetManager();
        }

        return this._instance;
    }

     /**
     * Retrieves an asset by its ID.
     * @param {string} assetId - The ID of the asset to retrieve.
     * @returns {Promise<any>} The asset object, or an error message if retrieval fails.
     */
    public async getAsset(assetId: string): Promise<any> {
        try{
            return await Assets.get(assetId);
        } catch (error) {
            console.error('Error getting asset:', error);
        }
    }

    /**
     * Produces a Spine object from the asset data.
     * @param {string} assetId - The ID of the asset containing spine data.
     * @returns {Promise<Spine>} A Spine object, or an error message if loading fails.
     */
    public async produceSpine(assetId: string): Promise<Spine> {
        try{
            const spineData = await this.loadAsset(assetId);
            return new Spine(spineData.spineData);
        } catch (error) {
            console.error('Error getting spine data:', error);
        }
    }

    /**
     * Loads a bundle of assets and stores it in the bundles map.
     * Dispatches an event once the bundle is loaded.
     * @param {string} bundle - The name of the bundle to load.
     * @returns {Promise<void>} A promise that resolves when the bundle is loaded.
     */
    public async loadAssetBundle(bundle: string): Promise<void> {
        EventDispatcher.instance.dispatcher.emit(SystemEvents.BUNDLE_LOADING);
        try{
            const bundleAssets = await Assets.loadBundle(bundle);
            this.bundles.set(bundle, bundleAssets);
            this.evaluateTotalMemory(bundleAssets);
            EventDispatcher.instance.dispatcher.emit(SystemEvents.BUNDLE_LOADED,{id: bundle, assets: bundleAssets});
        } catch (error) {
            console.error('Error loading bundle:', error);
        }
    }

    /**
     * Unloads a bundle of assets and clears it from the cache.
     * @param {string} bundle - The name of the bundle to unload.
     * @returns {Promise<any>} A promise that resolves when the bundle is unloaded.
     */
    public async unloadAssetBundle(bundle: string): Promise<any> {
        try{
            await Assets.unloadBundle(bundle);
            this.clearPixiCache(bundle);
        } catch (error) {
            console.error('Error unloading bundle:', error);
        }
    }

    /**
     * Loads an individual asset.
     * @param {string} path - The path to the asset.
     * @returns {Promise<any>} The loaded asset, or an error message if loading fails.
     */
    public async loadAsset(path: string): Promise<any> {
        try {
        return await PIXI.Assets.load(path);
        } catch (error) {
            console.error('Error loading asset:', error);
        }
    }

    /**
     * Unloads an individual asset from memory.
     * @param {string} path - The path to the asset.
     * @returns {Promise<any>} A promise that resolves when the asset is unloaded.
     */
    public async unloadAsset(path: string): Promise<any> {
        try{
            return await PIXI.Assets.unload(path);
        } catch (error) {
            console.error('Error unloading asset:', error);
        }
    }

    /**
     * Initializes the asset manager by loading the manifest file.
     * @private
     * @returns {Promise<void>} A promise that resolves when the manifest is loaded.
     */
    private async initAssetManager() {
        try{
            await Assets.init({ manifest: "./assets/manifest.json" });
        } catch (error) {
            console.error('Error initializing manifest:', error);
        }
    }

    /**
     * Clears PIXI's cache for the specified asset bundle.
     * @private
     * @param {string} bundle - The name of the bundle to clear from cache.
     */
    private clearPixiCache(bundle: string) {
        if(!this.bundles.has(bundle)) return;

        const bundleAssets = this.bundles.get(bundle);
        for (const key in bundleAssets) {
            if (bundleAssets.hasOwnProperty(key)) {
                PIXI.Texture.removeFromCache(key);
            }
        }
        this.bundles.delete(bundle);
    }

    /**
     * Evaluates the total memory usage of the loaded assets in a bundle.
     * @private
     * @param {any} bundle - The bundle of assets to evaluate.
     */
    private evaluateTotalMemory(bundle: any) {
        let totalMemory: number = 0;
        for (const key in bundle) {
            if (bundle.hasOwnProperty(key)) {
                totalMemory += MathUtils.imageSizeInByte(bundle[key].width, bundle[key].height);
            }
        }

        EventDispatcher.instance.dispatcher.emit(SystemEvents.MEMORY_UPDATE, totalMemory);
    }

}