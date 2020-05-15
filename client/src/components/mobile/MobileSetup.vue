<template>
    <div class="mobile-setup">
        <template v-if="mode === 'connection'">
            <nav></nav>
            <div class="brief">
                <div>
                    <img src="@/assets/png/eye.png"/>
                </div>
                <div class="text">
                    <p>
                        Mâle Gaze est une expérience cinématographique vous plongeant dans les coulisses du cinéma. </p>
                    <p>Pour assister à la séance, rendez-vous sur <strong>malegaze.com</strong> à partir d’un
                        ordinateur. </p>
                </div>
                <button @click="startCalibration">Commencer</button>
            </div>
            <div class="separator">
                <span>Votre ticket de cinéma</span>
            </div>
            <div class="keyboard">
                <h2>Male gaze</h2>
                <span>Une expérience de 15 minutes</span>
                <div class="keyboard__display">
                    <div>
                        <span>Salle</span>
                    </div>
                    <div>
                        <span>Prix</span>
                    </div>
                    <hr/>
                    <div class="bottom">
                        <span>Place</span>
                    </div>
                    <div class="bottom">
                        <span>Rangée</span>
                    </div>
                </div>
                <div class="keyboard__content">
                    <div class="number">1</div>
                    <div class="number">2</div>
                    <div class="number">3</div>
                    <div class="number">4</div>
                    <div class="number">5</div>
                    <div class="number">6</div>
                    <div class="number">7</div>
                    <div class="number">8</div>
                    <div class="number">9</div>
                    <div class="delete">
                        <img src="@/assets/png/delete.png"/></div>
                    <div class="action">
                        <button>Action</button>
                    </div>
                </div>
            </div>
            <footer></footer>
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
        nav, footer {
            background: #FF4040;
            width: 100%;
            height: 14px;
        }

        .brief {
            height: calc(100vh - 25px);
            border-bottom: 2px dashed white;
            font-size: 18px;

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
                font-size: 18px;
            }
        }

        .keyboard {
            width: 80%;
            margin: 35px auto auto;
            text-transform: uppercase;

            h2 {
                font-size: 35px;
                font-weight: normal;
            }

            span {
                font-size: 13px;
            }

            &__display {
                border-top: 2px solid white;
                display: flex;
                flex-wrap: wrap;
                margin-top: 30px;

                hr {
                    width: 100%;
                    border-top: 1px solid white;
                    margin: 20px auto;
                    background: none;
                }

                div {
                    width: 50%;
                    padding: 10px 40px 40px 10px;
                    margin-top: 15px;
                    display: flex;

                    span {
                        font-size: 16px;
                        text-transform: uppercase;
                    }

                    &:nth-of-type(2n) {
                        border-left: 1px solid white;
                    }

                    &.bottom {
                        margin-top: 0;
                    }
                }
            }

            &__content {
                width: 90%;
                display: flex;
                flex-wrap: wrap;
                margin: 20px auto 40px auto;
                text-align: center;
                align-items: center;

                .number {
                    width: 33%;
                    padding: 15px 30px;
                    font-size: 30px;
                }

                .delete {
                    width: 33%;
                }

                .action {
                    width: 67%;
                    text-align: left;

                    button {
                        border: 1px solid #FF4040;
                        text-transform: uppercase;
                        color: #FF4040;
                        background: transparent;
                        border-radius: 0;
                        font-size: 18px;
                        padding-left: 40px;
                        position: relative;
                        width: calc(100% - 30px);

                        &:before {
                            content: "";
                            position: absolute;
                            width: 13px;
                            height: 11px;
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-image: url("/png/arrow.png");
                            left: 20px;
                            top: calc(50% - 5.5px);
                        }
                    }
                }
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
