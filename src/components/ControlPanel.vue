<template>
    <div class="ControlPanel">
        <button @click="chans">Chans</button>
        <button @click="chansM">Chans-m</button>
        <button @click="maxAngle">maxAngleEdge?</button>
        <button @click="partialGH">BuildPartialGH</button><br>
        <span style="color:white">m:</span>
        <input type="number" name="m" id="" v-model="m">
    </div>
</template>

<script>
export default {
    name: "ControlPanel",
    methods: {
        chans() {
            this.$store.dispatch("chans");
        },
        chansM(){
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
.ControlPanel {
    height: 100%;
    width: 22rem;
    flex: none;
    background: rebeccapurple;
}
</style>