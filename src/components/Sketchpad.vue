<template>
    <div class="sketchpad">
        <svg id="svg" width="100%" height="100%" @click="addPoint">
            <line
                v-for="e in edges"
                :key="e"
                :x1="e.x0"
                :x2="e.x1"
                :y1="e.y0"
                :y2="e.y1"
                :style="{ stroke: e.color }"
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
.sketchpad {
    height: 100%;
    background-color: lightBlue;
    flex: 1;
}
circle {
    filter: brightness(75%);
}
line {
    stroke-width: 2;
}
</style>