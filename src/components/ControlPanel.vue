<template>
    <div class="ControlPanel">
        <button @click="chans">Chans</button>
        <button @click="chansM">Chans-m</button>
        <button @click="maxAngle">maxAngleEdge?</button>
        <button @click="partialGH">BuildPartialGH</button><br />
        <span style="color: white">m:</span>
        <input type="number" name="m" id="" v-model="m" />
    </div>
</template>

<script>
export default {
    name: "ControlPanel",
    methods: {
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

.ControlPanel button:hover {
    background-color: #1b49b4;
    transition: all 0.3s ease-in-out;
}
</style>