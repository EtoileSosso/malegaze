<template>
    <div class="impact">
        <div class="impact__header">
            <div class="impact__header__title">
                L’impact du Male Gaze
            </div>
            <div class="impact__header__line"></div>
            <div class="impact__header__borderBottom"></div>
        </div>
        <div class="impact__content">
            <div class="impact__content__quotes">
                “Je n’étais jamais assez parfaite. J’étais trop grosse.
                J’étais trop maigre. J’étais stupide. J’étais malpolie.
                Je ne servais à rien. J’étais une mauvaise actrice, et tant d’autres choses”
            </div>
            <img src="@/assets/png/end_meganfox.png" alt="Megan Fox, considérée comme un sex symbole"/>
            <div class="impact__content__text">
                Le male gaze est tellement ancré dans notre société qu’on n’y prête plus attention,
                c’est devenu une norme qui pénètre notre inconscient, l’inconscient collectif
                et influence grandement nos rapports hommes / femmes.
            </div>
        </div>
        <div class="impact__borderBottom">
            <p>3/4</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MobileEndImpact"
    }
</script>

<style lang="scss" scoped>

    .impact {

        &__header {
            background-color: #202020;
            width: 100vw;
            height: 60vh;
            padding: 50px;
            position: relative;

            &__title {
                font-family: "Roboto Mono", sans-serif;
                font-weight: normal;
                font-size: 35px;
                color: #ffff;
                margin-top: 30px;
            }

            &__line {
                width: 100%;
                height: 5px;
                background-image: linear-gradient(to right, #ffff 50%, #202020 50%);
                background-position: top;
                background-size: 21px 2px;
                background-repeat: repeat-x;
                margin: 15px 0;
            }

            &__borderBottom {
                position: absolute;
                bottom: 0;
                left: 0;

                width: 100%;
                height: 7px;
                background-color: #FF4040;
            }

        }

        &__content {

            background-color: #ffff;
            padding: 50px 0;
            position: relative;

            &__quotes {
                font-family: 'Roboto', sans-serif;
                font-size: 25px;
                font-weight: lighter;
                font-style: italic;
                color: #FF4040;
                padding: 0 50px;
            }

            &__subQuotes {

                margin-top: 37px;
                margin-bottom: 80px;

                &--title {
                    color: #202020;
                    font-family: "Roboto Mono", sans-serif;
                    font-size: 20px;
                    text-align: center;
                }

                &--desc {
                    color: #202020;
                    font-family: "Roboto Mono", sans-serif;
                    font-size: 14px;
                    font-weight: lighter;
                    text-align: center;
                }

            }

            img {
                margin-top: 50px;
            }

            &__image {
                width: 100%;
                height: 270px;
                background-color: #f2f2f2;

            }

            &__text {
                margin: 80px 0;
                color: #202020;
                font-family: "Roboto", sans-serif;
                font-size: 20px;
                font-weight: lighter;
                padding: 0 50px;
            }

        }

        &__borderBottom {
            width: 100%;
            height: 50px;
            background-color: #FF4040;
            display: flex;
            justify-content: flex-end;
            padding: 0 50px;

            p {
                font-family: "Roboto Mono", sans-serif;
                font-size: 20px;
            }

        }
    }

</style>