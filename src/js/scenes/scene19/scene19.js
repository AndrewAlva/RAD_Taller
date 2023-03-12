import * as THREE from 'three'
import polenVert from './polenVertex.glsl'
import polenFrag from './polenFragment.glsl'
import flowerPlaneVert from './flowerPlaneVert.glsl'
import flowerPlaneFrag from './flowerPlaneFrag.glsl'
import { SketchScene } from '../SketchScene.js'
import { Line3D } from '../../modules/Line3D.js'

class Sketch extends SketchScene {
    constructor( _config = {} ) {
        super(_config);
        this.drumLerping = 0;
    }

    init() {
        super.init();
        this.setup();
    }

    setup() {
        var _this = this;
        _this.rt1Scene.background = new THREE.Color(0xffffff);

        /**
         * Base Class config
         */
        _this.controller.debugger.speed.object.speed = 0.02;
        _this.controller.debugger.speed.object.currentSpeed = 0.02;
        _this.controller.debugger.speed.updateDisplay();

        /**
         * Texture loader
         */
        _this.loadingManager =  new THREE.LoadingManager()
        _this.textureLoader = new THREE.TextureLoader(_this.loadingManager)


        /**
         * Objects
         */
        _this.polenSetup();
        _this.flowerSetup();

    }

    draw() {
        var _this = this;
        

        // Audio input
        const drum = AC.audioSignal(AC.analyserNode, AC.frequencyData, 150, 2500);
        _this.drumLerping = Math.damp(
            _this.drumLerping,
            drum,
            0.01,
            _this.time
        );
        
        _this.polenDraw();
    }

    /**
         * MIDI Handlers
         */
    updatePolenProgress(e) {
        var _this = this;
        let val = Math.range(e.velocity, 0, 127, 0.00001, 0.95);
        _this.controller.uPolenProgress.object.value = val;
        _this.controller.uPolenProgress.updateDisplay();
    }
    
    updateProgress(e) {
        var _this = this;
        let val = Math.range(e.velocity, 0, 127, 0.00001, 0.95);
        _this.controller.uProgress.object.value = val;
        _this.controller.uProgress.updateDisplay();
    }

    /**
     * Web Audio API Handlers
     */
    resetSignal() {
        var _this = this;
        if ( !_this.active ) return;

        _this.controller.uPolenSignal.object.value = 0;
        _this.controller.uPolenSignal.updateDisplay();
    }

    /**
     * Polen
     */
    polenSetup() {
        var _this = this;

        let planeSize = new THREE.Vector2(4.778, 1);
        
        _this.polenMaterial = new THREE.ShaderMaterial({
            vertexShader: polenVert,
            fragmentShader: polenFrag,
            side: THREE.DoubleSide,
            transparent: true,
            // depthTest: false,
            // wireframe: true,
            // blending: THREE.AdditiveBlending,
            uniforms: {
                uSize: { value: planeSize },
                
                uPolenProgress: { value: 1.0 }, // MIDI hooked
                uPolenSignal: { value: 0.16 }, // Microphone hooked
                
                uAnimate: { value: 0 },
                
                uStrength: { value: 1 }, // for line height
            },
        });

        _this.line1 = new Line3D({material: _this.polenMaterial, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line1._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line1._mesh);
        
        _this.material2 = _this.polenMaterial.clone();
        // _this.material2.uniforms.uStrength.value = 0.8;
        _this.line2 = new Line3D({material: _this.material2, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line2._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line2._mesh);
        
        _this.material3 = _this.polenMaterial.clone();
        // _this.material3.uniforms.uStrength.value = 0.6;
        _this.line3 = new Line3D({material: _this.material3, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line3._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line3._mesh);
        
        _this.material4 = _this.polenMaterial.clone();
        // _this.material4.uniforms.uStrength.value = 0.4;
        _this.line4 = new Line3D({material: _this.material4, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line4._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line4._mesh);
        
        _this.material5 = _this.polenMaterial.clone();
        // _this.material5.uniforms.uStrength.value = 0.2;
        _this.line5 = new Line3D({material: _this.material5, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line5._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line5._mesh);
        
        _this.material6 = _this.polenMaterial.clone();
        // _this.material6.uniforms.uStrength.value = 0.2;
        _this.line6 = new Line3D({material: _this.material6, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line6._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line6._mesh);

        /**
         * Audio controllers
         */
        _this.controller.uPolenSignal = _this.Debugger.add(_this.polenMaterial.uniforms.uPolenSignal, 'value').min(0).max(2).step(0.00001).name('uPolenSignal');
        ACEvents.addEventListener('AC_pause', _this.resetSignal.bind(_this));

        _this.controller.uPolenProgress = _this.Debugger.add(_this.polenMaterial.uniforms.uPolenProgress, 'value').min(0).max(1).step(0.00001).name('uPolenProgress');
        midiEvents.addEventListener('K1_change', _this.updatePolenProgress.bind(_this));
    }

    polenDraw() {
        var _this = this;

        _this.polenMaterial.uniforms.uAnimate.value = _this.animate + 5;
        _this.material2.uniforms.uAnimate.value = _this.animate + (1 * 1) + 5;
        _this.material3.uniforms.uAnimate.value = _this.animate + (2 * 1) + 5;
        _this.material4.uniforms.uAnimate.value = _this.animate + (3 * 1) + 5;
        _this.material5.uniforms.uAnimate.value = _this.animate + (4 * 1) + 5;
        _this.material6.uniforms.uAnimate.value = _this.animate + (5 * 1) + 5;

        if (AC.state.playing) {
            // Vertex updates
            
            // Fragment updates
            _this.controller.uPolenSignal.object.value = _this.drumLerping;
            _this.controller.uPolenSignal.updateDisplay();
        }
    }

    /**
     * Flower
     */
    flowerSetup() {
        var _this = this;
        /**
         * Object
         */
        let planeSize = new THREE.Vector2(0.98, 1);
        const geometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y, 300, 300)
        _this.texture1 = _this.textureLoader.load('img/daits-flower/b1.png')
        console.log(_this.texture1);
        
        _this.material = new THREE.ShaderMaterial({
            vertexShader: flowerPlaneVert,
            fragmentShader: flowerPlaneFrag,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            // blending: THREE.AdditiveBlending,
            uniforms: {
                uSize: { value: planeSize },
                
                uProgress: { value: 0.6 }, // MIDI hooked
                uSignal: { value: 0.5 }, // Microphone hooked
                tMap1: { value: _this.texture1 },
                
                uAnimate: { value: 0 },
            },
        });

        const mesh = new THREE.Mesh(geometry, _this.material)
        _this.rt1Scene.add(mesh)

        /**
         * Audio controllers
         */
        _this.controller.uSignal = _this.Debugger.add(_this.material.uniforms.uSignal, 'value').min(0).max(1).step(0.00001).name('uSignal');
        ACEvents.addEventListener('AC_pause', _this.resetSignal.bind(_this));

        _this.controller.uProgress = _this.Debugger.add(_this.material.uniforms.uProgress, 'value').min(0).max(1).step(0.00001).name('uProgress');
        midiEvents.addEventListener('K1_change', _this.updateProgress.bind(_this));
    }
    
    flowerDraw() {}
}

var Scene19 = new Sketch({sceneName: '19. Daits Flower'});
export {Scene19};