

export class MathUtils {

    /**
     * Generates a random integer within a specified range.
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (inclusive).
     * @returns {number} A random integer between min and max.
     */
    public static randomInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Converts bytes to gigabytes.
     * @param {number} bytes - The number of bytes.
     * @returns {number} The equivalent number of gigabytes.
     */
    public static bytesToGB(bytes: number): number {
        return bytes / 1073741824;
    }

    /**
     * Calculates the size of an image in bytes.
     * Assumes 4 bytes per pixel (RGBA).
     * @param {number} width - The width of the image.
     * @param {number} height - The height of the image.
     * @returns {number} The size of the image in bytes.
     */
    public static imageSizeInByte(width: number, height: number): number {
        return width * height * 4;
    }

}