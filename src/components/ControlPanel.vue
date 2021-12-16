<template>
    <div class="ControlPanel">
        <!-- <button @click="chans">Chans</button>
        <button @click="chansM">Chans-m</button>
        <button @click="maxAngle">maxAngleEdge?</button>
        <button @click="partialGH">BuildPartialGH</button><br />
        <span style="color: white">m:</span>
        <input type="number" name="m" id="" v-model="m" /> -->
        <div v-if="$store.state.step == 0" class="warpper">
            <div class="description">
                <div class="content">
                    <h1>Welcome!</h1>
                    <p>
                        This is a demo of
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://en.wikipedia.org/wiki/Chan%27s_algorithm"
                            >Chan's algorithm</a
                        >, named after Timothy M. Chan, an optimal
                        output-sensitive algorithm to compute the convex hull of
                        a set points.
                    </p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <button @click="nextStep">Start</button>
                </div>
            </div>
        </div>

        <div v-if="$store.state.step == 1" class="warpper">
            <div class="description">
                <div class="content">
                    <h2>1. Draw Some Points</h2>
                    <p>
                        Let's first add some points by simply clicking on the
                        empty plane! Also, you are encouraged to randomly add as
                        many points as possible.
                    </p>
                    <p>
                        Or, you can adjust the number of points you want by
                        dragging the bar below and click the button, we will
                        generate points automatically for you.
                    </p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        name="pointsNum"
                        id=""
                        v-model="pointsNum"
                    />
                    <button @click="addPoints">
                        Add {{ pointsNum }} Points
                    </button>
                    <button class="green" @click="nextStep">Next</button>
                    <button class="gray" @click="prevStep">Prev</button>
                </div>
            </div>
        </div>
        <div v-if="$store.state.step == 0"></div>
        <div v-if="$store.state.step == 0"></div>
        <div v-if="$store.state.step == 0"></div>
        <div v-if="$store.state.step == 0"></div>
    </div>
</template>

<script>
export default {
    name: "ControlPanel",
    data() {
        return {
            pointsNum: 50,
        };
    },
    methods: {
        nextStep() {
            this.$store.commit("nextStep");
        },

        prevStep() {
            this.$store.commit("prevStep");
        },

        addPoints() {
            document.getElementById("svg");
            this.$store.dispatch("addPoints", {
                number: this.pointsNum,
                maxX: document.getElementById("svg").clientWidth,
                maxY: document.getElementById("svg").clientHeight,
            });
        },

        chans() {
            this.$store.dispatch("chans");
        },
        chansM() {
            this.$store.dispatch("chansM");
        },
        maxAngle() {
            this.$store.commit("maxAngle");
        },
        partialGH() {
            this.$store.commit("partialGH");
        },
    },
    computed: {
        m: {
            get() {
                console.log("get");
                return this.$store.state.m;
            },
            set(value) {
                console.log("set");
                this.$store.commit("setM", value);
            },
        },
    },
};
</script>

<style>
.warpper {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
}

.warpper .description {
    width: 100%;
    height: 100%;
    min-height: 1.3rem;
    flex: 1;
}

.warpper .controller {
    width: 100%;
    min-height: 1.3rem;
    flex: none;
}
.warpper .content {
    margin: 2rem 2rem;
}

.ControlPanel input {
    width: 75%;
}

.controller .content {
    text-align: center;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
    .ControlPanel {
        width: 100%;
        min-height: 10rem;
        flex: none;
        background: rgb(51, 153, 85);
    }
    .ControlPanel button {
        background-color: #3365da;
        color: whitesmoke;
        border: none;
        outline: none;
        transition: all 0.3s ease-in-out;
        font-size: auto;
        margin: 0.5rem 0.2rem;
        /* width: 90%; */
        height: 2rem;
        border-radius: 0.5rem;
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
    .ControlPanel {
        height: 100%;
        width: 10rem;
        flex: none;
        background: rgb(51, 70, 153);
    }
    .ControlPanel button {
        background-color: #3365da;
        color: whitesmoke;
        border: none;
        outline: none;
        transition: all 0.3s ease-in-out;
        font-size: auto;
        margin-top: 0.5rem;
        width: 80%;
        height: 3rem;
        border-radius: 0.5rem;
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
    .ControlPanel {
        height: 100%;
        width: 12rem;
        flex: none;
        background: rgb(255, 65, 198);
    }
    .ControlPanel button {
        background-color: #3365da;
        color: whitesmoke;
        border: none;
        outline: none;
        transition: all 0.3s ease-in-out;
        font-size: auto;
        margin-top: 0.8rem;
        width: 80%;
        height: 3rem;
        font-size: 1rem;
        border-radius: 0.5rem;
    }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    .ControlPanel {
        height: 100%;
        width: 16rem;
        flex: none;
        background: rgb(153, 51, 51);
        flex-direction: column;
    }
    .ControlPanel button {
        background-color: #3365da;
        color: whitesmoke;
        border: none;
        outline: none;
        transition: all 0.3s ease-in-out;
        font-size: auto;
        margin-top: 1rem;
        width: 80%;
        height: 3rem;
        border-radius: 0.5rem;
    }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    .ControlPanel {
        height: 100%;
        width: 22rem;
        flex: none;
        background: rebeccapurple;
    }
    .ControlPanel button {
        background-color: #3365da;
        color: whitesmoke;
        border: none;
        outline: none;
        transition: all 0.3s ease-in-out;
        font-size: auto;
        margin-top: 1rem;
        width: 80%;
        height: 3rem;
        border-radius: 0.5rem;
    }
}
.ControlPanel button.green {
    background-color: #00ac64;
}

.ControlPanel button.gray {
    background-color: #383e46;
}

.ControlPanel button:hover {
    filter: brightness(125%);
    transition: all 0.3s ease-in-out;
}
.ControlPanel button:active {
    filter: brightness(80%);
    transition: all 0.1s ease-in-out;
}
</style>