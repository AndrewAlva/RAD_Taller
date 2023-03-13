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
        _this.flowerDraw();
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
    resetPolenSignal() {
        var _this = this;
        if ( !_this.active ) return;

        _this.controller.uPolenSignal.object.value = 0;
        _this.controller.uPolenSignal.updateDisplay();
    }

    resetSignal() {
        var _this = this;
        if ( !_this.active ) return;

        _this.controller.uSignal.object.value = 0;
        _this.controller.uSignal.updateDisplay();
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
        ACEvents.addEventListener('AC_pause', _this.resetPolenSignal.bind(_this));

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
         * Objects
         */
        // Layers
        _this.flowerLayersData = [
            { id: 'tallo', imgSrc: 'img/daits-flower/tallo.png', width: 0.4823, scale: 1},

            { id: 'h1', imgSrc: 'img/daits-flower/h1.png', width: 1.4460, scale: 0.5428},
            { id: 'h2', imgSrc: 'img/daits-flower/h2.png', width: 2.2062, scale: 0.5136},
            { id: 'h3', imgSrc: 'img/daits-flower/h3.png', width: 1.3454, scale: 0.6104},
            { id: 'h4', imgSrc: 'img/daits-flower/h4.png', width: 0.8564, scale: 0.8153},
            
            { id: 'p1', imgSrc: 'img/daits-flower/p1.png', width: 0.7390, scale: 0.7346},
            { id: 'p2', imgSrc: 'img/daits-flower/p2.png', width: 0.9431, scale: 0.6922},
            { id: 'p3', imgSrc: 'img/daits-flower/p3.png', width: 1.5714, scale: 0.4026},
            { id: 'p4', imgSrc: 'img/daits-flower/p4.png', width: 4.3928, scale: 0.1977},
            { id: 'p5', imgSrc: 'img/daits-flower/p5.png', width: 0.6025, scale: 0.7769},

            { id: 'b1', imgSrc: 'img/daits-flower/b1.png', width: 0.9841, scale: 0.4470},
            { id: 'b2', imgSrc: 'img/daits-flower/b2.png', width: 1.0276, scale: 0.3289},
            { id: 'b3', imgSrc: 'img/daits-flower/b3.png', width: 0.9047, scale: 0.4238},
            { id: 'b4', imgSrc: 'img/daits-flower/b4.png', width: 0.6004, scale: 0.4873},
            { id: 'b5', imgSrc: 'img/daits-flower/b5.png', width: 0.6590, scale: 0.4883},

            { id: 'core', imgSrc: 'img/daits-flower/core.png', width: 1.0833, scale: 0.1574},
        ];

        _this.flowerLayers = [];
        _this.flowerGroup = new THREE.Group();
        _this.rt1Scene.add(_this.flowerGroup);
        _this.flowerLayersData.forEach((layer, idx) => {
            _this.flowerLayers[layer.id] = _this.flowerLayer(layer);
        });

        // Positions
        _this.flowerLayers.tallo.mesh.position.set(0.48, -0.6);

        _this.flowerLayers.h1.mesh.position.set(0.619, 0.08);
        _this.flowerLayers.h2.mesh.position.set(-0.81, -0.1285);
        _this.flowerLayers.h3.mesh.position.set(-0.421, -0.348);
        _this.flowerLayers.h4.mesh.position.set(0.02, -0.52);
        
        _this.flowerLayers.p1.mesh.position.set(-0.113, 0.35);
        _this.flowerLayers.p2.mesh.position.set(-0.288, 0.295);
        _this.flowerLayers.p3.mesh.position.set(-0.4, 0.07);
        _this.flowerLayers.p4.mesh.position.set(-0.166, -0.175);
        _this.flowerLayers.p5.mesh.position.set(0.272, 0.254);
        
        _this.flowerLayers.b1.mesh.position.set(0.082, 0.045);
        _this.flowerLayers.b2.mesh.position.set(-0.182, 0.0175);
        _this.flowerLayers.b3.mesh.position.set(-0.16, 0.15);
        _this.flowerLayers.b4.mesh.position.set(-0.029, 0.2);
        _this.flowerLayers.b5.mesh.position.set(0.176, 0.17);
        
        _this.flowerLayers.core.mesh.position.set(-0.03, 0.086);
    }

    flowerLayer({id, imgSrc, width, scale = 1}) {
        var _this = this;
        var keys = {
            texture: `texture_${id}Flower`,
            material: `material_${id}Flower`,
            uSignal: `uSignal_${id}Flower`,
            uProgress: `uProgress_${id}Flower`,
        }

        let planeSize = new THREE.Vector2(width, 1).multiplyScalar(scale);
        const geometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y, 300, 300)
        _this[keys.texture] = _this.textureLoader.load(imgSrc)
        
        _this[keys.material] = new THREE.ShaderMaterial({
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
                tMap1: { value: _this[keys.texture] },
                
                uAnimate: { value: 0 },
            },
        });

        const mesh = new THREE.Mesh(geometry, _this[keys.material])
        _this.flowerGroup.add(mesh)

        /**
         * Audio controllers
         */
        _this.controller[keys.uSignal] = _this.Debugger.add(_this[keys.material].uniforms.uSignal, 'value').min(0).max(1).step(0.00001).name(keys.uSignal);
        _this.controller[keys.uProgress] = _this.Debugger.add(_this[keys.material].uniforms.uProgress, 'value').min(0).max(1).step(0.00001).name(keys.uProgress);
        function resetSignal() {
            if ( !_this.active ) return;
    
            _this.controller[keys.uSignal].object.value = 0;
            _this.controller[keys.uSignal].updateDisplay();
        }
        function updateProgress(e) {
            let val = Math.range(e.velocity, 0, 127, 0.00001, 0.95);
            _this.controller[keys.uProgress].object.value = val;
            _this.controller[keys.uProgress].updateDisplay();
        }
        ACEvents.addEventListener('AC_pause', resetSignal.bind(_this));
        midiEvents.addEventListener('K1_change', updateProgress.bind(_this));

        /**
         * Animations
         */
        function drawLayer() {
            _this[keys.material].uniforms.uAnimate.value = _this.animate;
            
            if (AC.state.playing) {
                // Vertex updates
                
                // Fragment updates
                _this.controller[keys.uSignal].object.value = _this.drumLerping;
                _this.controller[keys.uSignal].updateDisplay();
            }
        }

        return {
            mesh: mesh,
            shader: _this[keys.material],
            draw: drawLayer,
            keys: keys
        }
    }

    flowerDraw() {
        var _this = this;
        for (const key in _this.flowerLayers) {
            if (_this.flowerLayers.hasOwnProperty(key)) {
                _this.flowerLayers[key].draw();
            }
        }
    }
}

var Scene19 = new Sketch({sceneName: '19. Daits Flower'});
export {Scene19};