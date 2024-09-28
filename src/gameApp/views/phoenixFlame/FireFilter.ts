import * as PIXI from 'pixi.js';

export class FireFilter extends PIXI.Filter {
    constructor(width : number, height: number) {
        // Vertex shader (standard for PixiJS filters)
        const vertexShader = `
            attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;
            uniform mat3 projectionMatrix;
            varying vec2 vTextureCoord;
            void main(void){
                vTextureCoord = aTextureCoord;
                gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            }
        `;

        // Fragment shader to create a fire animation
        const fragmentShader = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float u_time;
            uniform vec2 u_resolution;

            // Simplex noise function for fire effect
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            float noise(vec2 p){
                vec2 i = floor(p);
                vec2 f = fract(p);
                float a = rand(i);
                float b = rand(i + vec2(1.0, 0.0));
                float c = rand(i + vec2(0.0, 1.0));
                float d = rand(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) +
                       (c - a) * u.y * (1.0 - u.x) +
                       (d - b) * u.x * u.y;
            }

            void main(void) {
                vec2 uv = vTextureCoord;
                float time = u_time * 0.5;

                // Adjust the speed and scale of the noise
                float n = noise(vec2(uv.x * u_resolution.x / 100.0, uv.y * u_resolution.y / 50.0 - time));

                // Create a color gradient for the fire
                vec3 fireColor = vec3(1.0, 0.5, 0.0) * n + vec3(1.0, 1.0, 0.0) * (1.0 - n);

                // Get the original texture color
                vec4 color = texture2D(uSampler, vTextureCoord);

                // Blend the fire effect with the texture
                gl_FragColor = vec4(fireColor, 1.0) * color;
            }
        `;

        // Initialize the filter with shaders and uniforms
        super(vertexShader, fragmentShader, {
            u_time: 0,
            u_resolution: [width, height],
        });
    }

    // Method to update the time uniform
    public update(delta: number) {
        this.uniforms.u_time += delta;
    }

    // Optional methods to update width and height
    public setSize(width: number, height: number) {
        this.uniforms.u_resolution = [width, height];
    }
}
