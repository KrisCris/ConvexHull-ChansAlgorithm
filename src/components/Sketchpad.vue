<template>
    <div class="sketchpad">
        <svg id="svg" @click="addPoint">
            <line
                v-for="e in edges"
                :key="e"
                :x1="e.x0"
                :x2="e.x1"
                :y1="e.y0"
                :y2="e.y1"
                :style="{ stroke: e.color, 'stroke-width': 2 }"
            ></line>
            <line
                v-if="scanEdge"
                :x1="scanEdge.x0"
                :x2="scanEdge.x1"
                :y1="scanEdge.y0"
                :y2="scanEdge.y1"
                :style="{ stroke: 'white', 'stroke-width': 2 }"
            ></line>
            <line
                v-for="e in fullHullEdges"
                :key="e"
                :x1="e.x0"
                :x2="e.x1"
                :y1="e.y0"
                :y2="e.y1"
                :style="{ stroke: e.color, 'stroke-width': 4 }"
            ></line>
            <circle
                v-for="v in vertices"
                :key="v"
                :cx="v.xPos"
                :cy="v.yPos"
                r="5"
                :style="{ fill: v.color }"
            ></circle>
        </svg>
    </div>
</template>

<script>
export default {
    name: "Sketchpad",

    computed: {
        vertices() {
            return this.$store.getters.vertices;
        },

        edges() {
            return this.$store.getters.edges;
        },

        scanEdge() {
            return this.$store.state.scanEdge;
        },

        fullHullEdges() {
            return this.$store.state.fullHullEdges;
        },
    },
    methods: {
        addPoint(e) {
            this.$store.commit("addVertex", { x: e.offsetX, y: e.offsetY });
        },
    },
    mounted() {},
};
</script>

<style>
@media only screen and (max-width: 768px) {
    .sketchpad {
        height: 60vh;
        background-color: rgb(35, 39, 48);
        flex: none;
    }
}

@media only screen and (min-width: 768px) {
    .sketchpad {
        height: 100%;
        background-color: rgb(35, 39, 48);
        flex: 1;
    }
}

@keyframes newCircle {
    from {
        r: 0;
    }
    to {
        r: 5;
    }
}

circle {
    filter: brightness(75%);
    animation: newCircle 0.2s linear;
}

line {
    /* i don't know how to animate */
}

svg {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
}
</style>