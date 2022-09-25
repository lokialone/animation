import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import FragmentShader from './shader/fragment.glsl';
import vertexShader from './shader/vertex.glsl';
import imagesloaded from 'imagesloaded';
import Scroll from '@utils/scroll.js';
import gsap from 'gsap';
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
    public width!: number;
    public height!: number;
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
    left!: number;
    scrollTop!: number;
    images!: HTMLImageElement[];
    scroll!: {
        render: () => void;
        scrollToRender: number;
    };
    pointer!: THREE.Vector2;
    raycaster!: THREE.Raycaster;
    time: number;
    constructor(options: OceanOption) {
        const {container} = options;
        this.uniforms = {value: 1.0};
        this.container = container;
        const preloadImages = new Promise((resolve, reject) => {
            imagesloaded(document.querySelectorAll('img'), {background: true}, resolve);
        });
        const allDone = [preloadImages];
        Promise.all(allDone).then(() => {
            this.sceneRrender();
        });
        this.time = 0;
        this.setUpResize();
        this.setUpMouseMoveListener();
    }
    sceneRrender() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.left = this.container.offsetLeft;
        this.meshes = [];
        this.scrollTop = 0;
        this.images = [...document.querySelectorAll('img')];
        this.init();

        // this.addObjects();
        this.addImages();
        this.setImagePosition();
        this.render();
        this.run();
        // Preload images
    }
    init() {
        // init camera
        const fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI);
        this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 100, 2000);
        this.camera.position.z = 600;
        this.camera.fov = fov;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize(this.width, this.height);
        // add controls
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.update();
        this.scroll = new Scroll();
        this.container.appendChild(this.renderer.domElement);
    }
    addImages() {
        this.images.forEach(img => {
            const bounds = img.getBoundingClientRect();
            const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height, 10, 10);
            // const texture = new THREE.Texture(img);
            // texture.needsUpdate = true;
            // ShaderMaterial;
            const material = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: {
                    uImage: {
                        value: new THREE.TextureLoader().load(img.src),
                        // value: texture,
                    },
                    hover: {
                        value: new THREE.Vector2(0.5, 0.5),
                    },
                    time: {
                        value: 0,
                    },
                    hoverState: {value: 0},
                },
                // color: 'red',
                vertexShader: vertexShader,
                fragmentShader: FragmentShader,
                // wireframe: true,
            });
            img.addEventListener('mouseenter', () => {
                gsap.to(material.uniforms.hoverState, {
                    duration: 1,
                    value: 1,
                });
            });
            img.addEventListener('mouseout', () => {
                gsap.to(material.uniforms.hoverState, {
                    duration: 1,
                    value: 0,
                });
            });

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
    run() {
        this.renderer.setAnimationLoop(this.animation.bind(this));
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animation(time: number) {
        this.scroll.render();
        this.scrollTop = this.scroll.scrollToRender;
        //  this.materials.forEach(m => {
        //      m.uniforms.time.value = this.time;
        //  });
        this.time += 0.05;
        this.meshes.forEach(m => {
            (m.mesh.material as THREE.ShaderMaterial).uniforms.time.value = this.time;
        });
        this.setImagePosition();
        this.renderer.render(this.scene, this.camera);
    }

    setUpResize() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    setUpMouseMoveListener() {
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        const onPointerMove = (event: MouseEvent) => {
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

            this.pointer.x = ((event.clientX - this.left) / (window.innerWidth - this.left)) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
            console.log(event.clientX, this.left);
            // 设置相交
            this.raycaster.setFromCamera(this.pointer, this.camera);

            // 计算物体和射线的焦点
            const intersects = this.raycaster.intersectObjects(this.scene.children);
            if (intersects.length) {
                console.log(intersects[0]);
                ((intersects[0].object as THREE.Mesh).material as THREE.ShaderMaterial).uniforms.hover.value =
                    intersects[0].uv;
            }
        };
        window.addEventListener('pointermove', onPointerMove);
    }
    resize() {
        // this.width = this.container.offsetWidth;
        // this.height = this.container.offsetHeight;
        // this.sceneRrender();
        // this.camera.aspect = this.width / this.height;
        // this.camera.updateProjectionMatrix();
        // this.renderer.setSize(this.width, this.height);
    }
    destroy() {
        window.removeEventListener('resize', () => {
            this.resize();
        });
    }
}
