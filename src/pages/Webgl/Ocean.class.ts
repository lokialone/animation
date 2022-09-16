import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
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
    constructor(options: OceanOption) {
        const {container} = options;
        this.container = container;
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.init();
        this.resize();
        this.addObjects();
        this.run();
        this.setUpResize();
    }

    init() {
        // init camera
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.render(this.scene, this.camera);
        // add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
        this.container.appendChild(this.renderer.domElement);
    }

    addObjects() {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }
    run() {
        this.renderer.setAnimationLoop(this.animation.bind(this));
    }

    animation(time: number) {
        this.mesh.rotation.x = time / 2000;
        this.mesh.rotation.y = time / 1000;
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
