import * as THREE from 'three'
import sceneVertex from './vertexSceneExample.glsl'
import sceneFragment from './fragmentSceneExample.glsl'
import { SketchScene } from '../SketchScene.js'

class Sketch extends SketchScene {
    constructor( _config = {} ) {
        super(_config);
        this.drumLerping = 0;
        console.log('Scene Example constructor');
    }

    init() {
        super.init();
        this.setup();
    }

    setup() {
        var _this = this;

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
            depthTest: false,
            // blending: THREE.AdditiveBlending,
            uniforms: {
                uSize: { value: planeSize },
                
                uProgress: { value: 0.6 }, // MIDI hooked
                uSignal: { value: 0.5 }, // Microphone hooked
                
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

    draw() {
        var _this = this;
        _this.material.uniforms.uAnimate.value = _this.animate;

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

var SceneEx = new Sketch({sceneName: '**0. Scene Example'});
export {SceneEx};