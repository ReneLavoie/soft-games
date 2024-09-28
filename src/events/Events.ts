
export type TotalHeap = {heapUsed: number, heapSize: number};
export class SystemEvents {

    public static BUNDLE_LOADED: string = "BUNDLE_LOADED";
    public static BUNDLE_LOADING: string = "BUNDLE_LOADING";
    public static WINDOW_RESIZE: string = "WINDOW_RESIZE";
    public static MEMORY_UPDATE: string = "MEMORY_UPDATE";
}