<template>
    <div class="calibration-screen">
        <img class="calibration-screen__target" src="@/assets/png/calibration.png" />
        <p class="calibration-screen__text">Tenez votre téléphone à la verticale.<br/>
            Visez l’écran pour le calibrer et commencer l’expérience.</p>
    </div>
</template>

<script>
    export default {
        name: "CalibrationScreen"
    }
</script>

<style lang="scss" scoped>

    .calibration-screen {
        text-align: center;

        &__target {
            // background-color: white;
            width: 70%;
        }

        &__text {
            margin-top: 60px;
        }
    }

    p {
        margin-top: 1rem;
    }
</style>
