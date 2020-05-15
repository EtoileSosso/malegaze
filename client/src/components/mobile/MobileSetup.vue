<template>
    <div class="mobile-setup">
        <template v-if="mode === 'connection'">
            <nav></nav>
            <div class="brief">
                <div>
                    <img  src="@/assets/png/eye.png"/>
                </div>
                <div class="text">
                    <p>
                        Mâle Gaze est une expérience cinématographique vous plongeant dans les coulisses du cinéma. </p>
                    <p>Pour assister à la séance, rendez-vous sur <strong>malegaze.com</strong> à partir d’un ordinateur. </p>
                </div>
                <button @click="startCalibration">Commencer</button>
            </div>
            <div class="separator">
                <span>Votre ticket de cinéma</span>
            </div>
            <div class="keyboard">
                <h2>Male gaze</h2>
                <span>Une expérience de 15 minutes</span>
            </div>
        </template>
        <template v-else-if="mode === 'calibration'">
            <CalibrationCamera v-on:finish="finishCalibration"/>
        </template>
    </div>
</template>

<script>
    import CalibrationCamera from "./setup/CalibrationCamera";

    export default {
        name: "MobileSetup",
        components: {CalibrationCamera},
        data() {
            return {
                mode: 'connection'
            }
        },
        sockets: {
            mobile_calibrate() {
                this.mode = 'calibration'
            },
            mobile_ready() {
                this.mode = 'ready'
            }
        },
        methods: {
            startCalibration() {
                this.$socket.emit('mobile_calibrate')
            },
            finishCalibration() {
                this.$socket.emit('mobile_ready')
            },
        }
    }
</script>

<style lang="scss" scoped>
    .mobile-setup {
        nav {
            background: #FF4040;
            width: 100%;
            height: 25px;
        }

        .brief {
            height: calc(100vh - 25px);
            border-bottom: 2px dashed white;
            div:first-of-type {
                text-align: center;
                margin: 30px 0;
            }

            .text {
                width: 90%;
                margin: 30px auto auto auto;

                strong {
                    color: #FF4040;
                    font-weight: normal;
                }
            }
        }

        .separator {
            margin-top: 5px;
            background: #FF4040;
            width: 100%;
            padding: 20px;
            text-align: center;

            span {
                text-transform: uppercase;
            }
        }

        .keyboard {
            width: 90%;
            margin: 30px auto auto;
            text-transform: uppercase;

            h2 {
              font-size: 32px;
            }
            span {
                font-size: 12px;
            }
        }
    }

    button {
        background: white;
        color: black;
        padding: 1rem;
        border-radius: 1rem;
        border: none
    }
</style>
