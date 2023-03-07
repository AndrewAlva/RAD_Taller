import * as THREE from 'three'
import sceneVertex from './vertexScene19.glsl'
import sceneFragment from './fragmentScene19.glsl'
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

        /**
         * Base Class config
         */
        _this.controller.debugger.speed.object.speed = 0.02;
        _this.controller.debugger.speed.object.currentSpeed = 0.02;
        _this.controller.debugger.speed.updateDisplay();


        /**
         * Object
         */
        let planeSize = new THREE.Vector2(4.778, 1);
        const geometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y, 300, 300)
        
        _this.material = new THREE.ShaderMaterial({
            vertexShader: sceneVertex,
            fragmentShader: sceneFragment,
            side: THREE.DoubleSide,
            transparent: true,
            // depthTest: false,
            // wireframe: true,
            // blending: THREE.AdditiveBlending,
            uniforms: {
                uSize: { value: planeSize },
                
                uProgress: { value: 1.0 }, // MIDI hooked
                uSignal: { value: 0.16 }, // Microphone hooked
                
                uAnimate: { value: 0 },
                
                uStrength: { value: 1 }, // for line height
            },
        });

        const mesh = new THREE.Mesh(geometry, _this.material)
        _this.line1 = new Line3D({material: _this.material, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line1._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line1._mesh)
        
        _this.material2 = _this.material.clone();
        // _this.material2.uniforms.uStrength.value = 0.8;
        _this.line2 = new Line3D({material: _this.material2, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line2._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line2._mesh)
        
        _this.material3 = _this.material.clone();
        // _this.material3.uniforms.uStrength.value = 0.6;
        _this.line3 = new Line3D({material: _this.material3, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line3._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line3._mesh)
        
        _this.material4 = _this.material.clone();
        // _this.material4.uniforms.uStrength.value = 0.4;
        _this.line4 = new Line3D({material: _this.material4, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line4._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line4._mesh)
        
        _this.material5 = _this.material.clone();
        // _this.material5.uniforms.uStrength.value = 0.2;
        _this.line5 = new Line3D({material: _this.material5, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line5._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line5._mesh)
        
        _this.material6 = _this.material.clone();
        // _this.material6.uniforms.uStrength.value = 0.2;
        _this.line6 = new Line3D({material: _this.material6, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line6._mesh.rotation.z = Math.radians(180);
        _this.rt1Scene.add(_this.line6._mesh)

        /**
         * Audio controllers
         */
        _this.controller.uSignal = _this.Debugger.add(_this.material.uniforms.uSignal, 'value').min(0).max(2).step(0.00001).name('uSignal');
        ACEvents.addEventListener('AC_pause', _this.resetSignal.bind(_this));

        _this.controller.uProgress = _this.Debugger.add(_this.material.uniforms.uProgress, 'value').min(0).max(1).step(0.00001).name('uProgress');
        midiEvents.addEventListener('K1_change', _this.updateProgress.bind(_this));

        _this.rt1Scene.background = new THREE.Color(0xffffff);
    }

    draw() {
        var _this = this;
        _this.material.uniforms.uAnimate.value = _this.animate + 5;
        _this.material2.uniforms.uAnimate.value = _this.animate + (1 * 1) + 5;
        _this.material3.uniforms.uAnimate.value = _this.animate + (2 * 1) + 5;
        _this.material4.uniforms.uAnimate.value = _this.animate + (3 * 1) + 5;
        _this.material5.uniforms.uAnimate.value = _this.animate + (4 * 1) + 5;
        _this.material6.uniforms.uAnimate.value = _this.animate + (5 * 1) + 5;

        // Audio input
        const drum = AC.audioSignal(AC.analyserNode, AC.frequencyData, 150, 2500);
        _this.drumLerping = Math.damp(
            _this.drumLerping,
            drum,
            0.01,
            _this.time
        );
        
        if (AC.state.playing) {
            // Vertex updates
            
            // Fragment updates
            _this.controller.uSignal.object.value = _this.drumLerping;
            _this.controller.uSignal.updateDisplay();
        }
    }

    /**
         * MIDI Handlers
         */
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

        _this.controller.uSignal.object.value = 0;
        _this.controller.uSignal.updateDisplay();
    }
}

var Scene19 = new Sketch({sceneName: '19. Daits Flower'});
export {Scene19};