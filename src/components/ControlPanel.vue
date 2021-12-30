<template>
    <div class="ControlPanel">
        <!-- step 0 -->
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
        <!-- step 1 -->
        <div v-if="$store.state.step == 1" class="warpper">
            <div class="description">
                <div class="content">
                    <h2>1. Draw Some Points</h2>
                    <p>Let's first add some points (more than 3) by simply clicking on the empty plane!</p>
                    <p>Or, you can let us add certain amount of points for you by dragging the bar below and click the button.</p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <input
                        :disabled="!$store.state.canRun"
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        name="pointsNum"
                        id=""
                        v-model="pointsNum"
                    /><br>
                    <div class="btnGroup">
                        <button :disabled="!$store.state.canRun" @click="addPoints">
                            Add {{ pointsNum }} Points
                        </button>
                        <button
                            :disabled="!($store.state.canRun && enoughPoints)"
                            class="green"
                            @click="nextStep"
                        >
                            Next
                        </button>
                        <button
                            :disabled="!$store.state.canRun"
                            class="gray"
                            @click="prevStep"
                        >
                            Prev
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
        <!-- step 2 -->
        <div v-if="$store.state.step == 2" class="warpper">
            <div class="description">
                <div class="content">
                    <h2>2. How does it work</h2>
                    <p>
                        Chan’s idea was to partition the points into groups of
                        equal size. There are m points in each group, and so the
                        number of groups is r = ⌈n/m⌉. For each group we compute
                        its hull using
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://en.wikipedia.org/wiki/Graham_scan"
                            >Graham’s scan</a
                        >. Then we run
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://en.wikipedia.org/wiki/Gift_wrapping_algorithm"
                            >Jarvis’s march</a
                        >
                        with bineary search on the groups, which has m steps.
                    </p>
                    <p>
                        To compute m, we start with a small value of it and
                        increase it rapidly until the algorithm returns a
                        successful result.
                    </p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <div class="btnGroup">
                        <button class="green" @click="nextStep">Demo</button>
                        <button class="gray" @click="prevStep">Prev</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- step 3 -->
        <div v-if="$store.state.step == 3" class="warpper">
            <div class="description">
                <div class="content">
                    <h2 v-if="$store.state.subStep<3">Step {{$store.state.subStep+1}}/3</h2>
                    <p v-if="$store.state.subStep==0">The first step is dividing the points into groups each with the size of m.</p>
                    <p class="val" v-if="$store.state.subStep==0" >m = min(2<sup>2</sup><sup><sup>#iteration</sup></sup>, #points) = {{$store.state.rawResults[$store.state.round].m}}</p>
                    <p v-if="$store.state.subStep==1">Now, we are going to compute the convex hull of each subset of points using Graham's Scan.</p>
                    <p v-if="$store.state.subStep==2">Starting from the up-most vertex in the plane, m number of convex edges will be computed using Jarvis’s March.</p>
                    <h2 v-if="$store.state.subStep==3 && !$store.state.rawResults[$store.state.round].isCompleted">More Iterations Required</h2>
                    <h2 v-if="$store.state.subStep==3 && $store.state.rawResults[$store.state.round].isCompleted">Process Complete</h2>
                    <p v-if="$store.state.subStep==3 && !$store.state.rawResults[$store.state.round].isCompleted">Oh no, m is too small! We need increase m in order to warp the entire shape!</p>
                    <p v-if="$store.state.subStep==3 && $store.state.rawResults[$store.state.round].isCompleted">The convex hull is successfully computed. Now, you can manually tweak the m value, or restart the demo!</p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <div class="btnGroup">
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep==0" class="green" @click="groupPoints">Group Points</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep==1" class="green" @click="grahamScan">Graham’s Scan</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep==2" class="green" @click="jarvisMarch">Jarvis’s March</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep==3 && !$store.state.rawResults[$store.state.round].isCompleted" class="green" @click="nextRound">Next Iteration</button>
                        <button :disabled="!$store.state.canRun" v-if="!($store.state.subStep==3 && $store.state.rawResults[$store.state.round].isCompleted)" @click="auto">Auto</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep==3 && $store.state.rawResults[$store.state.round].isCompleted" @click="runAgain">Run it again</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep==3 && $store.state.rawResults[$store.state.round].isCompleted" @click="nextStep" class="green">Try other m values</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep==3 && $store.state.rawResults[$store.state.round].isCompleted" @click="restart" class="gray">Home</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="$store.state.step == 4" class="warpper">
            <div class="description">
                <div class="content">
                    <h2>The Playground</h2>
                    <p>
                        Feel free to test more m values!
                    </p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <div class="mSettings">
                        <input
                            :disabled="!$store.state.canRun"
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            name="pointsNum"
                            id=""
                            v-model="m"
                        />
                        <button :disabled="!$store.state.canRun" class="green" @click="mChans">
                            Run m = {{m}}
                        </button>
                    </div>
                    <div class="mSettings">
                        <input
                            :disabled="!$store.state.canRun"
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            name="pointsNum"
                            id=""
                            v-model="pointsNum"
                        />
                        <button :disabled="!$store.state.canRun" @click="addPoints">
                            Add {{ pointsNum }} Points
                        </button>
                    </div>

                    <button
                        :disabled="!$store.state.canRun"
                        class="gray"
                        @click="restart"
                    >
                        Home
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ControlPanel",
    data() {
        return {
            pointsNum: 20,
        };
    },
    methods: {
        nextStep() {
            this.$store.dispatch("nextStep");
        },

        prevStep() {
            this.$store.dispatch("prevStep");
        },

        addPoints() {
            document.getElementById("svg");
            this.$store.dispatch("addPoints", {
                number: this.pointsNum,
                maxX: document.getElementById("svg").clientWidth,
                maxY: document.getElementById("svg").clientHeight,
            });
        },

        groupPoints() {
            this.$store.dispatch("groupPoints")
        },

        grahamScan() {
            this.$store.dispatch("grahamScan")
        },

        jarvisMarch() {
            this.$store.dispatch("jarvisMarch")
        },

        nextRound() {
            this.$store.commit("nextRound")
        },

        restart(){
            this.$store.commit("restart")
        },
        mChans(){
            this.$store.dispatch("mChans")
        },
        auto() {
            this.$store.dispatch("auto")
        },
        runAgain() {
            this.$store.commit("prepRunAgain")
        }
    },
    computed: {
        m: {
            get() {
                return this.$store.state.m;
            },
            set(value) {
                this.$store.commit("setM", value);
            },
        },
        enoughPoints(){
            return this.$store.state.rawVertices.length >= 3
        }
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

.ControlPanel input {
    width: 75%;
}

.controller .content {
    text-align: center;
}

.val {
    background-color: rgba(0, 0, 0, 0.164);
    text-align: center;
    padding: 0.25rem 0rem 0.5rem 0rem;
    border-radius: 0.5rem;
}

@media only screen and (max-width: 768px) {
    .btnGroup{
        display:flex;
        flex-flow: row;
        justify-content: center
    }
    .gray{
        order: -1;
    }
    .warpper .content {
        margin: 0.5rem 0.5rem;
    }
    .warpper .content .mSettings input{
        width:60%;
    }
    .warpper .content .mSettings button{
        min-width:20%;
        margin-left: 5%;
    }
    .ControlPanel {
        width: 100%;
        padding-bottom: 4rem;
        flex: 1;
        background: rgb(51, 153, 85);
        box-shadow: 0px -5px 10px #1a1a1a;
    }
    .ControlPanel button {
        background-color: #3365da;
        color: whitesmoke;
        border: none;
        min-width: 5rem;
        outline: none;
        transition: all 0.3s ease-in-out;
        font-size: auto;
        margin: 0.5rem 0.2rem;
        height: 2rem;
        border-radius: 0.5rem;
    }
}

@media only screen and (min-width: 768px) {
    .warpper .content {
        margin: 0.5rem 0.5rem;
    }
    .warpper .content p{
        font-size: 0.9rem;
    }
    .warpper .content h1{
        font-size: 1.7rem;
    }
    .warpper .content h2{
        font-size: 1.2rem;
    }
    .warpper .content p{
        font-size: 0.9rem;
    }

    .warpper .content .mSettings{
        margin-top: 2rem;
    }

    .ControlPanel {
        height: 100%;
        width: 16rem;
        flex: none;
        background: rgb(51, 153, 85);
        box-shadow: -4px 5px 10px #161616;
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
        height: 2rem;
        font-size: auto;
        border-radius: 0.5rem;
    }
}

@media only screen and (min-width: 992px) {
    .warpper .content {
        margin: 2rem 2rem;
    }

    .warpper .content .mSettings{
        margin-top: 2rem;
    }

    .ControlPanel {
        height: 100%;
        width: 22rem;
        flex: none;
        background: rgb(51, 153, 85);
        box-shadow: -4px 5px 10px #161616;
        z-index:0;
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

.ControlPanel button:disabled {
    background-color: #9b9b9b;
    color: #525252;
    transition: all 0.1s ease-in-out;
}
</style>