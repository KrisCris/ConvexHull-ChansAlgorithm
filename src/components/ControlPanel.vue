<template>
    <div class="ControlPanel">
        <!-- step 0 -->
        <div v-if="$store.state.step == 0" class="warpper">
            <div class="description">
                <div class="content">
                    <h1>Welcome!</h1>
                    <p>
                        This is a demo of
                        <a target="_blank" rel="noopener noreferrer"
                            href="https://en.wikipedia.org/wiki/Chan%27s_algorithm">Chan's algorithm</a>, named after
                        Timothy M. Chan, an optimal
                        output-sensitive algorithms that construct the convex hull
                        of a set of <tag class="val">n</tag> points in two or three dimensions in worst-case optimal <tag
                            class="val">O(n log h)</tag> time and <tag class="val">O(n)</tag> space, where <tag class="val">
                            h</tag> denotes the number of vertices of the convex hull.
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
                    <p>
                        Let's first add some points (more than 3) by simply clicking on the empty plane!
                    </p>
                    <p>
                        Or, a number of points can be added automatically via the slider and the button below.
                    </p>

                    <p>
                        Note: You can change the animation duration from the settings.
                    </p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <input :disabled="!$store.state.canRun" type="range" min="1" max="100" step="1" name="pointsNum" id=""
                        v-model="pointsNum" /><br>
                    <div class="btnGroup">
                        <button :disabled="!$store.state.canRun" @click="addPoints">
                            Add {{ pointsNum }} Points
                        </button>
                        <button :disabled="!($store.state.canRun && enoughPoints)" class="green" @click="nextStep">
                            Next
                        </button>
                        <button :disabled="!$store.state.canRun" class="gray" @click="prevStep">
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
                    <h2>2. How it works</h2>
                    <p>
                        Choose a parameter <tag class="val">m</tag> between <tag class="val">1</tag> and <tag class="val">n
                        </tag> and partition the points of size <tag class="val">n</tag> into <tag class="val">⌈n/m⌉</tag>
                        groups of equal size at most <tag class="val">m</tag>.
                        Compute the convex hull of each group using <a target="_blank" rel="noopener noreferrer"
                            href="https://en.wikipedia.org/wiki/Graham_scan">Graham's scan</a>.
                        Then, wrapping the shape using <a target="_blank" rel="noopener noreferrer"
                            href="https://en.wikipedia.org/wiki/Gift_wrapping_algorithm">Jarvis's march</a> on these groups
                        for at most <tag class="val">m</tag> steps.
                    </p>
                    <p>
                        Since the value of <tag class="val">h</tag> is unknown, we use a sequence of <tag class="val">m
                        </tag>'s to "guess" its value, until the convex hull is successfully computed.
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
                    <h2 v-if="$store.state.subStep < 3">Step {{ $store.state.subStep + 1 }}/3</h2>
                    <p v-if="$store.state.subStep == 0">
                        To find the value <tag class="val">m</tag> that computes the convex hull, The first step is dividing
                        the points of size <tag class="val">n</tag> into groups of each of size <tag class="val">m</tag>,
                        where
                    <p class="val">m = min { 2<sup>2<sup>t</sup></sup>, n }, t = #iteration</p>
                    <p>
                        Note: As suggested in Idea 4 in the material, the sequence of <tag class="val">m =
                            2<sup>t<sup>2</sup></sup>, t = 2, 3, ...</tag> might works better for 2D.
                    </p>
                    </p>
                    <p v-if="$store.state.subStep == 1">Now, we are going to compute the convex hull on each subset of
                        points using Graham's Scan. The processing time is <tag class="val">O((n / m) (m log m)) = O(n log
                            m)</tag>.</p>
                    <p v-if="$store.state.subStep == 2">
                        Starting from the up-most vertex, a wrapping step can be done by scanning all <tag class="val">⌈m /
                            n⌉</tag> polygons and computing tangents or supporting lines of the polygons through the current
                        vertex. By using binarty search for the tangent finding, the time required for a wrapping step is
                        then <tag class="val">O((n / m) log m)</tag>. Since we are running at most <tag class="val">m</tag>
                        steps, the total running time is <tag class="val">O(n log m)</tag> or <tag class="val">O(h (n / m)
                            log)</tag> when the algorithm finishes.
                    </p>
                    <h2 v-if="$store.state.subStep == 3 && !$store.state.rawResults[$store.state.round].isCompleted">We are
                        not finishing yet...</h2>
                    <h2 v-if="$store.state.subStep == 3 && $store.state.rawResults[$store.state.round].isCompleted">Process
                        Complete</h2>
                    <p v-if="$store.state.subStep == 3 && !$store.state.rawResults[$store.state.round].isCompleted">As you
                        may notice, the <tag class="val">m</tag> is too small to warp the entire hull. More iterations are
                        required to find a better value.</p>
                    <p v-if="$store.state.subStep == 3 && !$store.state.rawResults[$store.state.round].isCompleted">
                        But don't be worry, since the m searching stops as it reaches or exceeds h, the #iterations is at
                        most <tag class="val">⌈log log n⌉</tag>, and the <tag class="val">t</tag>th iteration takes <tag
                            class="val">O(n<sup>2<sup>t</sup></sup>)</tag> time, therefore the total running time is <tag
                            class="val">O(n log h)</tag>.
                    </p>
                    <p v-if="$store.state.subStep == 3 && $store.state.rawResults[$store.state.round].isCompleted">The
                        convex
                        hull is successfully computed. Now, you can manually tweak the m value, or restart the demo!</p>
                </div>
            </div>

            <div class="controllor">
                <div class="content">
                    <div class="btnGroup">
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep == 0" class="green"
                            @click="groupPoints">Group Points</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep == 1" class="green"
                            @click="grahamScan">Graham’s Scan</button>
                        <button :disabled="!$store.state.canRun" v-if="$store.state.subStep == 2" class="green"
                            @click="jarvisMarch">Jarvis’s March</button>
                        <button :disabled="!$store.state.canRun"
                            v-if="$store.state.subStep == 3 && !$store.state.rawResults[$store.state.round].isCompleted"
                            class="green" @click="nextRound">Next Iteration</button>
                        <button :disabled="!$store.state.canRun"
                            v-if="!($store.state.subStep == 3 && $store.state.rawResults[$store.state.round].isCompleted)"
                            @click="auto">Auto</button>
                        <button :disabled="!$store.state.canRun"
                            v-if="$store.state.subStep == 3 && $store.state.rawResults[$store.state.round].isCompleted"
                            @click="runAgain">Run it again</button>
                        <button :disabled="!$store.state.canRun"
                            v-if="$store.state.subStep == 3 && $store.state.rawResults[$store.state.round].isCompleted"
                            @click="nextStep" class="green">Try other m values</button>
                        <button :disabled="!$store.state.canRun"
                            v-if="$store.state.subStep == 3 && $store.state.rawResults[$store.state.round].isCompleted"
                            @click="restart" class="gray">Home</button>
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
                        <input :disabled="!$store.state.canRun" type="range" min="1" max="100" step="1" name="pointsNum"
                            id="" v-model="m" />
                        <button :disabled="!$store.state.canRun" class="green" @click="mChans">
                            Run m = {{ m }}
                        </button>
                    </div>
                    <div class="mSettings">
                        <input :disabled="!$store.state.canRun" type="range" min="1" max="100" step="1" name="pointsNum"
                            id="" v-model="pointsNum" />
                        <button :disabled="!$store.state.canRun" @click="addPoints">
                            Add {{ pointsNum }} Points
                        </button>
                    </div>

                    <button :disabled="!$store.state.canRun" class="gray" @click="restart">
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

        restart() {
            this.$store.commit("restart")
        },
        mChans() {
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
        enoughPoints() {
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
    min-height: 1.3rem;
    height: 100%;
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

tag.val {
    padding: 0rem 0.5rem;
}

@media only screen and (max-width: 768px) {
    .btnGroup {
        display: flex;
        flex-flow: row;
        justify-content: center;
    }

    .warpper .content h1 {
        font-size: 1.9rem;
    }

    .warpper .content p {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .warpper .content h2 {
        font-size: 1.4rem;
    }

    .warpper .content {
        padding-bottom: 1rem;
    }

    .warpper .description .content {
        padding-bottom: 0px;
    }

    .gray {
        order: -1;
    }

    .warpper .content {
        margin: 0.2rem 0.5rem;
    }

    .warpper .content .mSettings input {
        width: 60%;
    }

    .warpper .content .mSettings button {
        min-width: 20%;
        margin-left: 5%;
    }

    .ControlPanel {
        width: 100%;
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

    .warpper .content h1 {
        font-size: 1.7rem;
    }

    .warpper .content h2 {
        font-size: 1.2rem;
    }

    .warpper .content p {
        font-size: 0.9rem;
    }

    .warpper .content .mSettings {
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

    .warpper .content .mSettings {
        margin-top: 2rem;
    }

    .ControlPanel {
        height: 100%;
        width: 22rem;
        flex: none;
        background: rgb(51, 153, 85);
        box-shadow: -4px 5px 10px #161616;
        z-index: 0;
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
}</style>