import Scenery from "../Scenery";
import Camera from "../../camera/Camera";
import Model from "../../model/Model";
import Light from "../../light/Light";
import cameraTypes from "../../camera/cameraTypes";
import controlsTypes from "../../controls/controlsTypes";
import cameraman_sounds from "../../sound/cameraman/cameraman_sounds";
import * as THREE from "three";
import {lineToCurve} from "../../../helpers/Utils";
import {MathUtils} from "three";
import EventManager from "../../../event/EventManager";
import {Vector3} from "three";
import gsap from 'gsap'
import store from "../../../../store";
import appStates from "../../../appStates";
import THREEx from "../../light/VolumetricLightMaterial";

export default new Scenery({
    name: 'cameraman_scenery',
    renderer: null,
    cameras: [
        new Camera({
            type: cameraTypes.CINEMATIC,
            properties: {fov: 1, aspectRatio: window.innerWidth / window.innerHeight, near: 1, far: 1500},
            initialPosition: {x: -50, y: 150, z: -300},
            settings: {
                focalLength: 33,
                focusDistance: 100,
            },
        }),
        new Camera({
            type: cameraTypes.CINEMATIC,
            properties: {fov: 1, aspectRatio: window.innerWidth / window.innerHeight, near: 1, far: 1500},
            initialPosition: {x: 0, y: 0, z: 0},
            settings: {
                alphaOffset: MathUtils.degToRad(180),
                focalLength: 40,
                focusDistance: 120,
            },
        }),
        new Camera({
            type: cameraTypes.CINEMATIC,
            properties: {fov: 1, aspectRatio: window.innerWidth / window.innerHeight, near: 1, far: 1500},
            initialPosition: {x: 0, y: 0, z: 0},
            settings: {
                focalLength: 40,
                focusDistance: 300
            },
        }),
        new Camera({
            type: cameraTypes.CINEMATIC,
            properties: {fov: 1, aspectRatio: window.innerWidth / window.innerHeight, near: 1, far: 1500},
            initialPosition: {x: 30, y: 30, z: 30},
            settings: {
                alphaOffset: MathUtils.degToRad(180),
                focalLength: 60,
                focusDistance: 20
            },
        }),
        new Camera({
            type: cameraTypes.PERSPECTIVE,
            properties: {fov: 30, aspectRatio: window.innerWidth / window.innerHeight, near: 1, far: 1500},
            initialPosition: {x: 0, y: 300, z: 0},
        })
    ],
   // controls: controlsTypes.ORBIT,
    models: [
        new Model({
            name: 'cameraman_scenery',
            path: 'models/glb/cameraman_scenery_fail.glb',
            type: 'glb',
            castShadow: true,
            receiveShadow : true
        }),
        new Model({
            name: 'actress_scenery_woman',
            path: "models/glb/actress_scenery_woman.glb",
            type: 'gltf',
            castShadow : true,
            receiveShadow : false
        }),
        new Model({
            name: 'actress_scenery_decor',
            path: "models/glb/actress_scenery_decor.glb",
            type: 'gltf',
            castShadow : false,
            receiveShadow : true
        }),
        new Model({
            name: 'cones_cameraman_scenery',
            path: 'models/glb/cones_cameraman_scenery.glb',
            type: 'glb',
            castShadow: false,
            receiveShadow : false
        }),
        new Model({
            name: 'camera_splines',
            path: 'models/fbx/cameraman/camera_splines.fbx',
            type: 'fbx',
            castShadow: false,
            receiveShadow : false
        }),
    ],
    lights: [
        new Light({
            name: 'pointLight',
            light: new THREE.PointLight(0xFFE5A3, .7, 250),
            initialPosition: {x: 150, y: 150, z: -350},
            debug: false,
            castShadow: true
        }),
        new Light({
            name: 'spotLight',
            light:  new THREE.SpotLight( 0xFFE5BF, .4 ),
            initialPosition: {x: 200, y: 400, z: -550},
            debug: false,
            castShadow: false
        }),
    ],
    sounds: cameraman_sounds,
    onCreated: (self) => {

        // --------------------- //
        // ATTRIBUTES DEFINITIONS
        // --------------------- //

        // Camera animation
        self.camPosIndex = 0;
        self.cameraCurves = [];
        self.cameraProgress = 0;

        self.currentSequence = 0

        // TODO : Modulariser, utiliser des méthodes, ...

        self.sequences = [
            {
                name: 'context',
                cameraIndex: 0,
                init: (self) => {

                    const cameraPosition = self.cameraCurves.find(curve => curve.name === 'P0_TRAVEL').getPointAt(0)
                    self.cameraManager.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

                    self.soundManager.getSoundByName('cameraman_ambiance').play()

                    EventManager.publish('transition:start', {
                        text: 'Les propos qui vont suivre ont déjà été entendus sur des tournages.',
                    })

                    const transitionEvent = EventManager.subscribe('transition:ended', () => {
                        self.nextSequence(self)
                        transitionEvent.unsubscribe();
                    })

                },
                update: null
            },
            {
                name: 'intro',
                cameraIndex: 0,
                init: (self) => {
                    const cameraPosition = self.cameraCurves.find(curve => curve.name === 'P0_TRAVEL').getPointAt(0)
                    self.cameraManager.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

                    self.soundManager.getSoundObjectByName('01_real_intro').ended = () => {
                        self.nextSequence(self)
                    }
                    self.soundManager.getSoundObjectByName('01_real_intro').play()

                },
                update: null
            },
            {
                name: 'traveling intro',
                cameraIndex: 0,
                init: (self) => {
                    const tl = new gsap.timeline()
                    tl.pause(0);
                    tl.to(self.cameraManager.camera.rotation, {
                        duration: 12,
                        delay: 6,
                        ease: 'power2.inOut',
                        y: MathUtils.degToRad(MathUtils.radToDeg(self.cameraManager.camera.rotation.y) - 100),
                    })
                    tl.call(() => {
                        self.soundManager.getSoundObjectByName('02_real_intro_traveling').play()
                    }, [], '-=4')
                    tl.then(() => {
                        self.nextSequence(self)
                    })

                    self.followCurve(self, {
                        curveName: 'P0_TRAVEL',
                        camera: self.cameraManager.camera,
                        duration: 17,
                        ease: 'power1.out'
                    });

                    EventManager.publish('camera:start')
                    tl.play();
                    EventManager.publish('camera:rec', true)
                },
            },
            {
                name: 'transition to traveling',
                cameraIndex: 0,
                init: (self) => {

                    self.soundManager.getSoundObjectByName('03_real_transition_traveling').ended = () => {
                        self.nextSequence(self)
                    }
                    self.soundManager.getSoundObjectByName('03_real_transition_traveling').play()

                }
            },
            // Traveling
            {
                name: 'cadrage traveling',
                cameraIndex: 1,
                ready: false,
                init: () => {
                    self.cameraManager.setControls(controlsTypes.MOBILE)
                    const cameraPosition = self.cameraCurves.find(curve => curve.name === 'P1_TRAVEL').getPointAt(0)
                    self.cameraManager.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

                    EventManager.publish('mobile:interaction_set', 'framing')
                    self.soundManager.getSoundObjectByName('04_real_cadrage_traveling').play()

                    EventManager.publish('camera:instructions', {
                        text: 'Cadre les pieds de l\'actrice',
                        icon: '/icon/tutorial/tutorial_icon_framing.gif'
                    })

                    self.sequences[self.currentSequence].ready = true
                },
                update: (self) => {
                    const sequence = self.sequences[self.currentSequence]

                    // When ready
                    if(!sequence.ready) return

                    self.frameTarget(self, {
                        target: new Vector3(0.1,-0.54, 0.83),
                        threshold: .1,
                        camera: self.cameraManager.camera,
                        onComplete: (self) => {

                            sequence.ready = false

                            self.soundManager.getSoundObjectByName('05_real_traveling').ended = () => {
                                self.nextSequence(self)
                            }

                            self.cameraManager.controls = null
                            EventManager.publish('camera:instructions', false)
                            self.soundManager.getSoundObjectByName('05_real_traveling').play()
                        }
                    })

                }
            },
            {
                name: 'traveling',
                cameraIndex: 1,
                ready: false,
                init: () => {
                    self.cameraManager.controls = null
                    EventManager.publish('camera:instructions', false)
                    EventManager.publish('mobile:interaction_set', 'traveling')

                    EventManager.publish('camera:rec', true)
                    EventManager.publish('camera:instructions', {
                        text: 'Effectue un traveling',
                        icon: '/icon/tutorial/tutorial_icon_traveling.gif'
                    })
                    const curve = self.cameraCurves.find(curve => curve.name === 'P1_TRAVEL')
                    const finalPosition = curve.getPointAt(1)

                    const interactionEvent = EventManager.subscribe('mobile:interaction', (data) => {
                        // Check if traveling
                        if(data.type !== 'traveling') return
                        data.value *= 0.2
                        const position = curve.getPointAt(data.value)
                        self.cameraManager.camera.position.set(position.x, position.y, position.z)

                    })

                    // On interaciton done
                    const travelingEvent = EventManager.subscribe('mobile:interaction_done', () => {
                        self.sequences[self.currentSequence].ready = true
                        EventManager.publish('camera:instructions', false)
                        gsap.to(self.cameraManager.camera.position, {
                            duration: 5,
                            ease: 'power1.out',
                            x: finalPosition.x,
                            y: finalPosition.y,
                            z: finalPosition.z,
                        }).then(() => {
                            EventManager.publish('camera:rec', false)


                            self.soundManager.getSoundObjectByName('06_real_traveling_fin').ended = () => {
                                self.nextSequence(self)
                            }

                            self.soundManager.getSoundObjectByName('06_real_traveling_fin').play()
                        })

                        // Unsubscribe the events
                        interactionEvent.unsubscribe()
                        travelingEvent.unsubscribe();
                    })
                },
            },
            {
                name: 'transition to zoom',
                cameraIndex: 1,
                init: (self) => {
                    EventManager.publish('transition:start', {
                        text: '&laquo;&nbsp;Une femme sur un tournage c’est important, ça permet de canaliser les hommes.&nbsp;&raquo;',
                        comment: 'Un professeur de cinéma à ses élèves'
                    })

                    self.nextSequence(self)
                }
            },

            // Zoom
            {
                name: 'cadrage zoom',
                cameraIndex: 2,
                ready: false,
                init: () => {
                    EventManager.publish('camera:progress', 0)
                    self.cameraManager.setControls(controlsTypes.MOBILE)
                    const cameraPosition = self.cameraCurves.find(curve => curve.name === 'P2_ZOOM').getPointAt(0)
                    self.cameraManager.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
                    EventManager.publish('camera:aiming', {distance: 4, threshold: 1, aiming: false})
                    EventManager.publish('mobile:interaction_set', 'framing')

                    let transitionEvent = EventManager.subscribe('transition:ended', () => {

                        self.soundManager.getSoundObjectByName('07_real_zoom').ended = () => {
                            EventManager.publish('camera:instructions', {
                                text: 'Cadre Sean en contre-plongée',
                                icon: 'icon/tutorial/tutorial_icon_framing.gif'
                            })
                            self.sequences[self.currentSequence].ready = true
                            EventManager.publish('camera:instructions', false)

                        }

                        self.soundManager.getSoundObjectByName('07_real_zoom').play()

                        transitionEvent.unsubscribe()
                    })
                },
                update: (self) => {
                    const sequence = self.sequences[self.currentSequence]

                    // When ready
                    if(!sequence.ready) return

                    self.frameTarget(self, {
                        target: new Vector3(0.3,0.25, -0.9),
                        threshold: .1,
                        camera: self.cameraManager.camera,
                        onComplete: (self) => {
                            self.nextSequence(self)
                        }
                    })

                }
            },
            {
                name: 'zoom',
                cameraIndex: 2,
                ready: false,
                init: (self) => {
                    self.cameraManager.controls = null
                    EventManager.publish('mobile:interaction_set', 'zoom')
                    EventManager.publish('camera:instructions', {
                        text: 'Zoome en direction de Sean',
                        icon: 'icon/tutorial/tutorial_icon_zoom.gif'
                    })
                    const curve = self.cameraCurves.find(curve => curve.name === 'P2_ZOOM')
                    const finalPosition = curve.getPointAt(1)

                    EventManager.publish('camera:rec', true)

                    // On interaction
                    const interactionEvent = EventManager.subscribe('mobile:interaction', (data) => {
                        // Check if traveling
                        if(data.type !== 'zoom') return
                        data.value *= 0.2
                        const position = curve.getPointAt(data.value)
                        self.cameraManager.camera.position.set(position.x, position.y, position.z)
                    })

                    // On interaction done
                    const travelingEvent = EventManager.subscribe('mobile:interaction_done', () => {

                        EventManager.publish('camera:instructions', false)

                        gsap.to(self.cameraManager.camera.position, {
                            duration: 6,
                            ease: 'power1.out',
                            x: finalPosition.x,
                            y: finalPosition.y,
                            z: finalPosition.z,
                        }).then(() => {
                            EventManager.publish('camera:rec', false)

                            self.soundManager.getSoundObjectByName('08_real_zoom_fin').ended = () => {
                                self.nextSequence(self)
                            }

                            self.soundManager.getSoundObjectByName('08_real_zoom_fin').play()
                        })

                        // Unsubscribe the event
                        travelingEvent.unsubscribe();
                        interactionEvent.unsubscribe();
                    })
                },
            },
            {
                name: 'transition to rotation',
                cameraIndex: 2,
                init: (self) => {
                    EventManager.publish('transition:start', {
                        text: '&laquo;&nbsp;Il me faisait des baisers forcés dans le cou, c\'est arrivé très souvent.&nbsp;&raquo;',
                        comment: 'Une assistante réalisation à propos d\'un acteur très connu'
                    })

                    self.nextSequence(self)
                }
            },

            // Rotation
            {
                name: 'cadrage rotation',
                cameraIndex: 3,
                ready: false,
                init: () => {
                    EventManager.publish('camera:progress', 0)
                    self.cameraManager.setControls(controlsTypes.MOBILE)
                    const cameraPosition = self.cameraCurves.find(curve => curve.name === 'P3_ROTATION').getPointAt(0)
                    self.cameraManager.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
                    EventManager.publish('camera:aiming', {distance: 4, threshold: 1, aiming: false})

                    let transitionEvent = EventManager.subscribe('transition:ended', () => {

                        self.soundManager.getSoundObjectByName('09_real_transition_rotation').ended = () => {
                            self.soundManager.getSoundObjectByName('10_real_rotation').play()
                        }

                        self.soundManager.getSoundObjectByName('10_real_rotation').ended = () => {
                            EventManager.publish('mobile:interaction_set', 'framing')
                            self.sequences[self.currentSequence].ready = true
                            EventManager.publish('camera:instructions', {
                                text: 'Cadre les seins de l\'actrice',
                                icon: 'icon/tutorial/tutorial_icon_framing.gif',
                            })
                        }

                        self.soundManager.getSoundObjectByName('09_real_transition_rotation').play()

                        transitionEvent.unsubscribe()
                    })
                },
                update: (self) => {
                    const sequence = self.sequences[self.currentSequence]

                    // When ready
                    if(!sequence.ready) return

                    self.frameTarget(self, {
                        target: new Vector3(-0.16,-0.33, 0.9),
                        threshold: .1,
                        camera: self.cameraManager.camera,
                        onComplete: (self) => {
                            EventManager.publish('camera:instructions', false)
                            self.nextSequence(self)
                        }
                    })

                }
            },
            {
                name: 'rotation',
                cameraIndex: 3,
                ready: false,
                init: (self) => {
                    self.cameraManager.controls = null

                    EventManager.publish('mobile:interaction_set', 'rotation')

                    EventManager.publish('camera:rec', true)
                    EventManager.publish('camera:instructions', {
                        text: 'Pivote la caméra vers son visage',
                        icon: 'icon/tutorial/tutorial_icon_rotation.gif'
                    })

                    const y = self.cameraManager.camera.rotation.y
                    const finalRotation = y + MathUtils.degToRad(20)

                    // On interaction
                    const interactionEvent = EventManager.subscribe('mobile:interaction', (data) => {
                        // Check if traveling
                        if(data.type !== 'rotation') return
                        self.cameraManager.camera.rotation.y = y + (data.value * (finalRotation - y))
                    })

                    // On interaction done
                    const travelingEvent = EventManager.subscribe('mobile:interaction_done', () => {

                        self.sequences[self.currentSequence].ready = true

                        EventManager.publish('camera:rec', false)
                        EventManager.publish('camera:instructions', false)
                        EventManager.publish('mobile:interaction_set', null)

                        self.soundManager.getSoundObjectByName('11_real_rotation_fin').ended = () => {
                            self.nextSequence(self)
                        }

                        self.soundManager.getSoundObjectByName('11_real_rotation_fin').play()

                        // Unsubscribe events
                        travelingEvent.unsubscribe();
                        interactionEvent.unsubscribe();
                    })
                },
            },
            {
                name: '',
                cameraIndex: 3,
                init: (self) => { // eslint-disable-line
                    EventManager.publish('transition:start', {
                        text: '&laquo;&nbsp;Ça ne va pas, on peut la refaire ? <br> On ne voit pas assez ses seins.&nbsp;&raquo;',
                        comment: 'Un directeur artistique à une journaliste chargée du making-of'
                    })

                    let transitionEvent = EventManager.subscribe('transition:ended', () => {

                        EventManager.publish('camera:stop')

                        self.nextSequence(self)

                        transitionEvent.unsubscribe()
                    })
                }
            },
            {
                name: 'transition to actress scenery',
                cameraIndex: 3,
                init: (self) => { // eslint-disable-line

                    self.cameraManager.controls = null

                    EventManager.publish('camera:stop')

                    self.soundManager.getSoundObjectByName('12_real_fin').ended = () => {

                        EventManager.publish('cameraman:transition')

                        EventManager.subscribe('cameraman:nextScene', () => {
                            self.soundManager.getSoundByName('cameraman_ambiance').stop()
                            store.dispatch('app/requestState', appStates.ACTRESS)
                        });

                    }

                    self.soundManager.getSoundObjectByName('12_real_fin').play()
                }
            },
        ]

        // -- METHODS

        /** Go to next sequence */
        self.nextSequence = (self) => {
            if (self.currentSequence >= self.sequences.length) return // No next sequence
            self.currentSequence += 1
            self.cameraManager.changeCamera(self.sequences[self.currentSequence].cameraIndex)
            if(typeof self.sequences[self.currentSequence].init === 'function') self.sequences[self.currentSequence].init(self)
        }


        /** Display curve */
        self.displayCurve = (self, {curve}) => {
            const points = curve.getSpacedPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            const material = new THREE.LineBasicMaterial({color: 0x00ff00});

            // Create the final object to add to the scene
            let splineObject = new THREE.Line(geometry, material);

            self.scene.add(splineObject)
        }

        /**
         * Build volumetric lights
         * @param self
         * @param mesh
         * @param color
         */
        self.buildVolumetricLight = (self, {mesh, color}) => {
            const lightColor = color ?? 0xff0000;

            mesh.translateY(-100)
            mesh.material = new THREEx.VolumetricSpotLightMaterial(2.8, 5., mesh.position, new THREE.Color(lightColor), 1.);
            mesh.geometry = new THREE.CylinderGeometry(18., 200., 300, 32 * 2, 20, true);
            mesh.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 50, 0));

            const spotLight = new THREE.SpotLight(lightColor);
            spotLight.name = mesh.name + '_spotlight';
            spotLight.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
            spotLight.color = new THREE.Color(lightColor);
            spotLight.exponent = 30;
            spotLight.angle = 0.9;
            spotLight.intensity = 1;
            spotLight.decay = 0.5;
            spotLight.penumbra = 0.5;

            spotLight.target.position.set(mesh.position.x, 0, mesh.position.z);
            self.scene.add(spotLight);
            self.scene.add(spotLight.target);
        }

        self.buildDirectionnalLight = (object, {position}, {properties}, helper) => {
            var directionnalLight =  new THREE.DirectionalLight( properties.color, properties.intensity );
            directionnalLight.position.set(position.x,position.y, position.z);
            directionnalLight.target = object;
            self.scene.add(directionnalLight);

            if(helper) {
                var directionnalLightHelper = new THREE.DirectionalLightHelper( directionnalLight, 5 );
                self.scene.add( directionnalLightHelper );
            }
        };

        //Oui je sais c'est moche
        self.generateLightOnWoman = () => {


            var womanModel = self.modelManager.getLoadedModelByName('actress_scenery_woman').scene;

            var spotLight =  new THREE.SpotLight(0xFFE5A3, .2 );
            spotLight.position.set(0,400, 200);
            spotLight.target = womanModel.children[0];
            spotLight.castShadow = true;
            spotLight.shadow.camera.far = 1000      // default
            self.scene.add(spotLight);

            self.renderer.shadowMap.autoUpdate = false;
            self.renderer.shadowMap.needsUpdate = true;
        }


    },
    onLoaded: (self) => {
        console.log('self', self)

        self.manObj = null;

        let modelScene = self.modelManager.getLoadedModelByName('cameraman_scenery').scene;
        modelScene.children.forEach((child) => {
            if(child.name === 'DENNIS') {
                self.manObj = child;
            }
        });

        /*self.cameraManager.changeCamera(4)
        self.cameraManager.controls.object = self.cameraManager.cameraObjects[4].camera
        console.log(self.cameraManager.camera)*/


        // ---------------- //
        // Lights
        // ---------------- //

        // Build volumetric lights
        self.buildVolumetricLight(self, {mesh: self.scene.getObjectByName('LAMPE_ACTRICE'), color: 0xFFE5A3})
        self.buildVolumetricLight(self, {mesh: self.scene.getObjectByName('PROJECTEUR_01'), color: 0xDE2900})
        self.buildVolumetricLight(self, {mesh: self.scene.getObjectByName('PROJECTEUR_02'), color: 0xDE2900})

        setTimeout(() => {
            self.buildDirectionnalLight(self.manObj, {position : {x: -100, y: 150, z: 0}}, {properties : {color: 0xffffff, intensity : 0.5}}, false);
            self.buildDirectionnalLight(self.manObj, {position : {x: -100, y: 150, z: 80}}, {properties : {color: 0xC96934, intensity : 0.5}}, false);
            self.buildDirectionnalLight(self.manObj, {position : {x: 10, y: 350, z: 200}}, {properties : {color: 0x68AB54, intensity : 0.5}}, false);
            self.generateLightOnWoman();
        },500)


        // ---------------- //
        // Camera curves
        // ---------------- //

        if (self.scene.getObjectByName('camera_splines').children) {
            self.scene.getObjectByName('camera_splines').children.forEach((obj) => {
                if (obj.isLine) {
                    // Convert into curve
                    const curve = lineToCurve(obj)
                    // Add the curve into curves list
                    self.cameraCurves.push(curve)
                }
            })
        }
        // Remove splines from scene
        self.scene.remove(self.scene.getObjectByName('camera_splines'))

        // Display curves
        /*
        self.cameraCurves.forEach((curve => {
            self.displayCurve(self, {curve})
        }))
         */

        // Set camera positions
        self.cameraManager.cameras[0].rotation.y = MathUtils.degToRad(-90)

        // ---------------- //
        // Sound
        // ---------------- //

        // Add sound to camera
        self.soundManager.addToCamera(self.cameraManager.camera);

        // Fog
        self.scene.fog = new THREE.Fog(0x000000, 200, 1000);


        // --- METHODS

        /**
         * Follow the curve with camera
         * @param self
         * @param curveName
         * @param camera
         * @param {number} duration
         * @param {string} ease - Gsap ease
         */

        self.followCurve = (self, {curveName, camera, duration, ease = 'power1.out'}) => {
            // Set precision
            const nbPoints = 30

            // Get curve points
            const curve = self.cameraCurves.find((curve) => curve.name === curveName)
            if(!curve) return
            const points = curve.getSpacedPoints(nbPoints)
            const steps = points.map((point) => {
                return Object.assign({},{x: point.x, y: point.y, z: point.z})
            })

            // Add duration
            steps.forEach(point => point.duration = duration/nbPoints)

            // Run animation
            gsap.to(camera.position, {
                keyframes: steps,
                ease: ease,
            })
        }

        /**
         * Frame target
         * @param self
         * @param target
         * @param threshold
         * @param camera
         * @param onComplete
         */
        self.frameTarget = (self, {target, threshold, camera, onComplete}) => {

            const dir = camera.getWorldDirection(new THREE.Vector3(0, 0, 0))
            const distance = dir.distanceTo(target)

            EventManager.publish('camera:aiming', {distance, threshold: threshold, aiming: distance <= threshold})

            if(distance <= threshold) {
                if(self.cameraProgress < 100) {
                    self.cameraProgress += 1
                }else{
                    EventManager.publish('camera:progress_complete')
                    EventManager.publish('camera:aiming', {distance, threshold: threshold, aiming: false})
                    self.cameraProgress = 0
                    onComplete(self)
                }
                EventManager.publish('camera:progress', self.cameraProgress)
            }else {
                self.cameraProgress = 0
                EventManager.publish('camera:progress', self.cameraProgress)
            }
        }

        if(typeof self.sequences[self.currentSequence].init === 'function') self.sequences[self.currentSequence].init(self)
    },
    onUpdate: (self) => {
        if (typeof self.sequences[self.currentSequence].update === 'function') self.sequences[self.currentSequence].update(self)
    }

})
