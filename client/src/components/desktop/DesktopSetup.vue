<template>
    <div class="desktop-setup">
        <!-- <h1>Male Gaze</h1> -->
        <template v-if="mode==='connection'">
            <h2>Lancez <span>malegaze.com</span><br/>
                sur votre téléphone et renseignez votre place</h2>
            <!-- <h2>Scannez ce QR Code avec votre mobile.</h2> -->
            <!-- <QRCode v-if="mobileUrl" :url="mobileUrl" />
            <a v-if="mobileUrl" :href="mobileUrl" target="_blank">{{ mobileUrl }}</a> -->
            <div class="cinema-ticket">
                <div class="title">
                    <div>
                        <h3>Malegaze</h3>
                        <span>Un film malegaze</span>
                    </div>
                    <span>15 minutes</span>
                </div>
                <div class="numbers">
                    <div>
                        <span class="price-title">Salle</span>
                        <span class="price">7</span>
                    </div>
                    <div>
                        <span class="price-title">Prix</span>
                        <span class="price">4</span>
                    </div>
                    <div>
                        <span class="price-title">Place</span>
                        <span class="price">5</span>
                    </div>
                    <div>
                        <span class="price-title">Rangée</span>
                        <span class="price">8</span>
                    </div>
                </div>
                <div class="baseline">
                    <span>Bonne séance !</span>
                </div>
            </div>
        </template>
        <template v-else-if="mode==='calibration'">
            <CalibrationScreen/>
        </template>
    </div>
</template>

<script>
    // import QRCode from "./mobileConnection/QRCode";
    import CalibrationScreen from "./mobileConnection/CalibrationScreen";
    import appStates from "../../js/appStates";

    export default {
        name: "DesktopSetup",
        components: {
            CalibrationScreen, //QRCode
        },
        data() {
            return {
                mode: 'calibration'
            }
        },
        computed: {
            mobileUrl() {
                return this.$store.getters['mobile/mobileUrl']
            }
        },
        sockets: {
            mobile_calibrate() {
                this.mode = 'calibration'
            },
            mobile_ready() {
                this.next()
            }
        },
        methods: {
            next() {
                this.$socket.emit('state_request', appStates.INTRO)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .desktop-setup {
        background: #202020;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;

        h1 {
            margin-bottom: 2rem;
        }

        h2 {
            letter-spacing: 5px;
            font-size: 32px;
            font-weight: normal;
            width: 70%;
            text-align: center;
            line-height: 50px;
            margin-bottom: 5rem;

            span {
                color: #FF4040;
                text-transform: uppercase;
            }
        }

        .cinema-ticket {
            width: 60%;
            border-top: 1px solid white;
            border-bottom: 1px solid white;

            .title {
                display: flex;
                justify-content: space-between;
                padding: 15px 2px;
                border-bottom: 1px solid white;

                h3 {
                    font-weight: bold;
                    font-size: 32px;
                }

                span {
                    align-self: flex-end;
                }

                h3, span {
                    text-transform: uppercase;
                }
            }

            .numbers {
                padding: 15px 2px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid white;

                div {
                    border-right: 1px solid white;
                    display: flex;
                    flex-direction: column;
                    width: 25%;
                    padding: 10px 30px 0 0;

                    &:last-of-type {
                        border-right: none;
                    }

                    .price-title {
                        text-transform: uppercase;
                        text-align: center;
                        letter-spacing: 5px;
                        width: 100%;
                    }

                    .price {
                        color: #FF4040;
                        font-weight: bold;
                        font-size: 50px;
                        align-self: flex-end;
                    }
                }
            }

            .baseline {
                border-top: 1px solid white;
                text-transform: uppercase;
                text-align: center;
                padding: 15px 2px;

                span {
                    font-weight: bold;
                }
            }
        }
    }
</style>
