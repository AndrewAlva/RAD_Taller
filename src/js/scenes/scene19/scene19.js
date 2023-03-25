import * as THREE from 'three'
import { SketchScene } from '../SketchScene.js'
import { Line3D } from '../../modules/Line3D.js'
import polenVert from './polenVertex.glsl'
import polenFrag from './polenFragment.glsl'
import flowerPlaneVert from './flowerPlaneVert.glsl'
import flowerPlaneFrag from './flowerPlaneFrag.glsl'
import talloVert from './talloVert.glsl'
import talloFrag from './talloFrag.glsl'
import hojaVert from './hojaVert.glsl'
import hojaFrag from './hojaFrag.glsl'
import petaloVert from './petaloVert.glsl'
import petaloFrag from './petaloFrag.glsl'
import bulboVert from './bulboVert.glsl'
import bulboFrag from './bulboFrag.glsl'
import coreVert from './coreVert.glsl'
import coreFrag from './coreFrag.glsl'

class Sketch extends SketchScene {
    constructor( _config = {} ) {
        super(_config);
        this.drumLerping = 0;
        this.noPolen = true;
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
        // _this.uvTexture = _this.textureLoader.load('_assets/uv.jpg');
        _this.uvTexture = _this.textureLoader.load('_assets/uv2.png', function (texture) {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 2, 2 );
            texture.magFilter = THREE.NearestFilter
        });


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
        if (this.noPolen) return;
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

        _this.polenGroup = new THREE.Group();
        _this.rt1Scene.add(_this.polenGroup);
        _this.polenGroup.rotation.z = Math.PI * 0.16;
        _this.polenGroup.position.x = -0.35;
        _this.polenGroup.position.y = 0.7;
        _this.polenGroup.position.z = 0.026 * 5;

        _this.line1 = new Line3D({material: _this.polenMaterial, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line1._mesh.rotation.z = Math.radians(180);
        _this.line1._mesh.renderOrder = 14.5;
        _this.polenGroup.add(_this.line1._mesh);
        
        _this.material2 = _this.polenMaterial.clone();
        // _this.material2.uniforms.uStrength.value = 0.8;
        _this.line2 = new Line3D({material: _this.material2, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line2._mesh.rotation.z = Math.radians(180);
        _this.line2._mesh.renderOrder = 14.5;
        _this.polenGroup.add(_this.line2._mesh);
        
        _this.material3 = _this.polenMaterial.clone();
        // _this.material3.uniforms.uStrength.value = 0.6;
        _this.line3 = new Line3D({material: _this.material3, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line3._mesh.rotation.z = Math.radians(180);
        _this.line3._mesh.renderOrder = 14.5;
        _this.polenGroup.add(_this.line3._mesh);
        
        _this.material4 = _this.polenMaterial.clone();
        // _this.material4.uniforms.uStrength.value = 0.4;
        _this.line4 = new Line3D({material: _this.material4, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line4._mesh.rotation.z = Math.radians(180);
        _this.line4._mesh.renderOrder = 14.5;
        _this.polenGroup.add(_this.line4._mesh);
        
        _this.material5 = _this.polenMaterial.clone();
        // _this.material5.uniforms.uStrength.value = 0.2;
        _this.line5 = new Line3D({material: _this.material5, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line5._mesh.rotation.z = Math.radians(180);
        _this.line5._mesh.renderOrder = 14.5;
        _this.polenGroup.add(_this.line5._mesh);
        
        _this.material6 = _this.polenMaterial.clone();
        // _this.material6.uniforms.uStrength.value = 0.2;
        _this.line6 = new Line3D({material: _this.material6, height: 1.5, radius: 0.00375,  segments: 70, radialSegments: 20});
        _this.line6._mesh.rotation.z = Math.radians(180);
        _this.line6._mesh.renderOrder = 14.5;
        _this.polenGroup.add(_this.line6._mesh);

        /**
         * Audio controllers
         */
        _this.controller.uPolenSignal = _this.Debugger.add(_this.polenMaterial.uniforms.uPolenSignal, 'value').min(0).max(2).step(0.00001).name('uPolenSignal');
        ACEvents.addEventListener('AC_pause', _this.resetPolenSignal.bind(_this));

        _this.controller.uPolenProgress = _this.Debugger.add(_this.polenMaterial.uniforms.uPolenProgress, 'value').min(0).max(1).step(0.00001).name('uPolenProgress');
        midiEvents.addEventListener('K1_change', _this.updatePolenProgress.bind(_this));
    }

    polenDraw() {
        if (this.noPolen) return;
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
            // { id: 'tallo', shaderName:'tallo', imgSrc: 'img/daits-flower/tallo.png', zPos: 0, renderOrder: 1, width: 0.4823, scale: 1},

            // { id: 'h1', shaderName:'hoja', imgSrc: 'img/daits-flower/h1.png', zPos: 0.008, renderOrder: 5, width: 1.4460, scale: 0.5428},
            // { id: 'h2', shaderName:'hoja', imgSrc: 'img/daits-flower/h2.png', zPos: 0.006, renderOrder: 4, width: 2.2062, scale: 0.5136},
            // { id: 'h3', shaderName:'hoja', imgSrc: 'img/daits-flower/h3.png', zPos: 0.004, renderOrder: 3, width: 1.3454, scale: 0.6104},
            // { id: 'h4', shaderName:'hoja', imgSrc: 'img/daits-flower/h4.png', zPos: 0.002, renderOrder: 2, width: 0.8564, scale: 0.8153},
            
            // { id: 'p1', shaderName:'petalo', imgSrc: 'img/daits-flower/p1.png', zPos: 0.010, renderOrder: 6, width: 0.7390, scale: 0.7346},
            // { id: 'p2', shaderName:'petalo', imgSrc: 'img/daits-flower/p2.png', zPos: 0.012, renderOrder: 7, width: 0.9431, scale: 0.6922},
            // { id: 'p3', shaderName:'petalo', imgSrc: 'img/daits-flower/p3.png', zPos: 0.016, renderOrder: 9, width: 1.5714, scale: 0.4026},
            // { id: 'p4', shaderName:'petalo', imgSrc: 'img/daits-flower/p4.png', zPos: 0.014, renderOrder: 8, width: 4.3928, scale: 0.1977},
            // { id: 'p5', shaderName:'petalo', imgSrc: 'img/daits-flower/p5.png', zPos: 0.018, renderOrder: 10, width: 0.6025, scale: 0.7769},

            { id: 'b1', shaderName:'bulbo', imgSrc: 'img/daits-flower/b1.png', zPos: 0.030, renderOrder: 16, width: 0.9841, scale: 0.4470},
            { id: 'b2', shaderName:'bulbo', imgSrc: 'img/daits-flower/b2.png', zPos: 0.028, renderOrder: 15, width: 1.0276, scale: 0.3289},
            { id: 'b3', shaderName:'bulbo', imgSrc: 'img/daits-flower/b3.png', zPos: 0.024, renderOrder: 13, width: 0.9047, scale: 0.4238},
            { id: 'b4', shaderName:'bulbo', imgSrc: 'img/daits-flower/b4.png', zPos: 0.022, renderOrder: 12, width: 0.6004, scale: 0.4873},
            { id: 'b5', shaderName:'bulbo', imgSrc: 'img/daits-flower/b5.png', zPos: 0.020, renderOrder: 11, width: 0.6590, scale: 0.4883},

            { id: 'core', shaderName: 'core', imgSrc: 'img/daits-flower/core.png', zPos: 0.026, renderOrder: 14, width: 1.0833, scale: 0.1574},
        ];

        _this.flowerLayers = [];
        _this.flowerGroup = new THREE.Group();
        _this.rt1Scene.add(_this.flowerGroup);
        _this.flowerLayersData.forEach((layer, idx) => {
            _this.flowerLayers[layer.id] = _this.flowerLayer(layer);
        });

        // Positions
        _this.flowerLayers.tallo?.mesh.position.set(0.48, -0.6);

        _this.flowerLayers.h1?.mesh.position.set(0.619, 0.08);
        _this.flowerLayers.h2?.mesh.position.set(-0.81, -0.1285);
        _this.flowerLayers.h3?.mesh.position.set(-0.421, -0.348);
        _this.flowerLayers.h4?.mesh.position.set(0.02, -0.52);
        
        _this.flowerLayers.p1?.mesh.position.set(-0.113, 0.35);
        _this.flowerLayers.p2?.mesh.position.set(-0.288, 0.295);
        _this.flowerLayers.p3?.mesh.position.set(-0.4, 0.07);
        _this.flowerLayers.p4?.mesh.position.set(-0.166, -0.175);
        _this.flowerLayers.p5?.mesh.position.set(0.272, 0.254);
        
        _this.flowerLayers.b1?.mesh.position.set(0.082, 0.045);
        _this.flowerLayers.b2?.mesh.position.set(-0.182, 0.0175);
        _this.flowerLayers.b3?.mesh.position.set(-0.16, 0.15);
        _this.flowerLayers.b4?.mesh.position.set(-0.029, 0.2);
        _this.flowerLayers.b5?.mesh.position.set(0.176, 0.17);
        
        _this.flowerLayers.core?.mesh.position.set(-0.03, 0.086);
    }

    flowerLayer({id, shaderName, imgSrc, zPos, renderOrder, width, scale = 1}) {
        var _this = this;
        var keys = {
            texture: `texture_${id}Flower`,
            material: `material_${id}Flower`,
            uSignal: `uSignal_${id}Flower`,
            uProgress: `uProgress_${id}Flower`,
        }

        let planeSize = new THREE.Vector2(width, 1).multiplyScalar(scale);
        const geometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y, 300, 300);
        _this[keys.texture] = _this.textureLoader.load(imgSrc, function (texture) {
            texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 2, 2 );
            texture.magFilter = THREE.NearestFilter
        });
        var vertexShader, fragmentShader;
        var fillColor;

        switch(shaderName) {
            case 'tallo':
                vertexShader = talloVert;
                fragmentShader = talloFrag;
                fillColor = '#08606D';
                break;
            case 'hoja':
                vertexShader = hojaVert;
                fragmentShader = hojaFrag;
                fillColor = '#64336F';
                break;
            case 'petalo':
                vertexShader = petaloVert;
                fragmentShader = petaloFrag;
                fillColor = '#A87B37';
                break;
            case 'bulbo':
                vertexShader = bulboVert;
                fragmentShader = bulboFrag;
                fillColor = '#D8C9BC';
                break;
            case 'core':
                vertexShader = coreVert;
                fragmentShader = coreFrag;
                fillColor = '#FFD97A';
                break;
            default:
                console.error('Invalid Shader Name provided at flowerLayer() setup');
        }
        
        _this[keys.material] = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            // side: THREE.DoubleSide,
            side: THREE.FrontSide,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            // blending: THREE.AdditiveBlending,
            uniforms: {
                uSize: { value: planeSize },
                
                uProgress: { value: 1 }, // MIDI hooked
                uSignal: { value: 0.01 }, // Microphone hooked
                tMap1: { value: _this[keys.texture] },
                tMap2: { value: _this.uvTexture },
                uColor1: { value: new THREE.Color(fillColor) },
                
                uAnimate: { value: 0 },
            },
        });

        const mesh = new THREE.Mesh(geometry, _this[keys.material]);
        mesh.position.z = zPos * 5.;
        _this.flowerGroup.add(mesh);
        // _this.renderOrderCount = _this.renderOrderCount ? _this.renderOrderCount + 1 : 1;
        _this.renderOrderCount = renderOrder;
        mesh.renderOrder = _this.renderOrderCount;

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