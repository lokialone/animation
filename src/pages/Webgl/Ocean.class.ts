import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import FragmentShader from './shader/fragment.glsl';
import vertexShader from './shader/vertex.glsl';
import imagesloaded from 'imagesloaded';
// import Scroll from '@utils/scroll.js';
interface OceanOption {
    container: HTMLElement;
}
interface ImageMesh {
    mesh: THREE.Mesh;
    width: number;
    height: number;
    left: number;
    top: number;
    img: HTMLImageElement;
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
    meshes!: ImageMesh[];
    left: number;
    scrollTop: number;
    constructor(options: OceanOption) {
        const {container} = options;
        this.uniforms = {value: 1.0};
        this.container = container;
        this.width = container.offsetWidth;
        this.height = container.offsetHeight;
        this.left = container.offsetLeft;
        console.log(this.container);
        console.log(this.width, this.height);
        this.meshes = [];
        this.scrollTop = 0;

        imagesloaded(document.querySelectorAll('img'), () => {
            this.init();
            // this.resize();
            // this.addObjects();
            this.addImages();
            this.setImagePosition();
            this.render();
            this.run();
            window.addEventListener('scroll', () => {
                this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                console.log(this.scrollTop);
            });
            // this.setUpResize();
        });
    }
    init() {
        // init camera
        const fov = (2 * Math.atan(this.height / 2 / 600) * 180) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 100, 2000);
        this.camera.position.z = 600;
        this.camera.fov = fov;
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
            const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height, 10, 10);
            const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
            const mesh = new THREE.Mesh(geometry, material);

            this.scene.add(mesh);
            this.meshes.push({
                mesh: mesh,
                img: img,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height,
                top: bounds.top,
            });
            return;
        });
    }
    setImagePosition() {
        this.meshes.forEach((mesh: ImageMesh) => {
            mesh.mesh.position.x = mesh.left + mesh.width / 2 - this.width / 2 - this.left;
            mesh.mesh.position.y = this.scrollTop + this.height / 2 - mesh.top - mesh.height / 2;
        });
    }
    addObjects() {
        const geometry = new THREE.PlaneGeometry(984, 200, 10, 10);
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
        // this.scrollTop = this.scroll.scrollToRender;
        this.setImagePosition();
        // this.controls.update();
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
