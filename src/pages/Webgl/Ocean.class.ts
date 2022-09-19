import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import FragmentShader from './shader/fragment.glsl';
import vertexShader from './shader/vertex.glsl';
import imagesloaded from 'imagesloaded';

interface OceanOption {
    container: HTMLElement;
}

export default class Ocean {
    public width: number;
    public height: number;
    public container: HTMLElement;
    public camera!: THREE.PerspectiveCamera;
    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    controls!: OrbitControls;
    mesh!: THREE.Mesh;
    material!: THREE.Material;
    uniforms: {
        value: number;
    };
    constructor(options: OceanOption) {
        const {container} = options;
        this.uniforms = {value: 1.0};
        this.container = container;
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        imagesloaded(document.querySelectorAll('img'), () => {
            this.init();
            // this.resize();
            // this.addObjects();

            this.addImages();
            this.render();
            // this.run();
            // this.setUpResize();
        });
    }

    init() {
        // init camera
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 500, 2000);
        this.camera.position.z = 600;
        this.camera.fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize(this.width, this.height);
        // add controls
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.update();
        this.container.appendChild(this.renderer.domElement);
    }
    addImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const bounds = img.getBoundingClientRect();
            console.log('bounds: ', bounds);
            const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height, 10, 10);
            const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
        });
    }

    addObjects() {
        const geometry = new THREE.PlaneGeometry(200, 200, 10, 10);
        // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            vertexShader: vertexShader,
            fragmentShader: FragmentShader,
            wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }
    run() {
        this.renderer.setAnimationLoop(this.animation.bind(this));
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animation(time: number) {
        // this.mesh.rotation.x = time / 2000;
        // this.mesh.rotation.y = time / 1000;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setUpResize() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
    destroy() {
        window.removeEventListener('resize', () => {
            this.resize();
        });
    }
}
