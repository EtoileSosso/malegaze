<template>
    <button class="request-orientation" @click="request" type="button" v-bind:class="isCameraButton ? 'camera' : ''">{{ text }}</button>
</template>

<script>
    export default {
        name: "OrientationPermissionButton",
        props: {
            text: {
                type: String,
                default: "Orientation Permission"
            },
            isCameraButton: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            motionRequest() {
                return new Promise((resolve, reject) => {
                    if (typeof DeviceOrientationEvent.requestPermission === 'function' ) {
                        // iOS 13+

                        DeviceOrientationEvent.requestPermission().then( ( response ) => {

                            if ( response === 'granted' ) {
                                resolve(response)
                            }

                        } ).catch( function ( error ) {
                            console.error( 'THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error );
                            reject(error)
                        } );

                    } else {
                        // Other devices
                        resolve()
                    }
                })

            },
            request() {
                this.motionRequest()
                    .then(() => {
                        this.$store.commit('mobile/setOrientationPermission', true)
                        this.$emit('success')
                    })
                    .catch((error) => {
                        this.$emit('fail', error)
                    })
            }
        },
    }
</script>

<style lang="scss" scoped>
    button {
        background: white;
        color: black;
        letter-spacing: 5px;

        &.camera {
            text-transform: uppercase;
            color: #FF4040;
            border: 1px solid #FF4040;
            border-radius: 0;
            background: transparent;
            bottom: 5rem;
            right: 0;
            left: calc(50% - 90px);
        }
    }
</style>
