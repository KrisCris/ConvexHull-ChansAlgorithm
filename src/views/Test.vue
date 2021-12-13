<template>
    <Nav></Nav>
    <svg class="line-chart" :viewBox="viewBox">
        <g transform="translate(0, 10)">
            <path class="line-chart line" :d="line" />
        </g>
    </svg>
</template>

<script>
import * as d3 from "d3";
import Nav from "../components/Nav.vue";

export default {
    name: "Test",
    components: { Nav },

    mounted() {
        console.log("mounted");
    },
    props: {
        data: {
            default: [1, 45, 5, 2, 46, 7],
            type: Array,
        },
        width: {
            default: 500,
            type: Number,
        },
        height: {
            default: 270,
            type: Number,
        },
    },
    data() {
        return {
            padding: 60,
        };
    },
    computed: {
        rangeX() {
            const width = this.width - this.padding;
            return [0, width];
        },
        rangeY() {
            const height = this.height - this.padding;
            return [0, height];
        },
        path() {
            const x = d3.scaleLinear().range(this.rangeX);
            const y = d3.scaleLinear().range(this.rangeY);
            d3.axisLeft().scale(x);
            d3.axisTop().scale(y);
            x.domain(d3.extent(this.data, (d, i) => i));
            y.domain([0, d3.max(this.data, (d) => d)]);
            return d3
                .line()
                .x((d, i) => x(i))
                .y((d) => y(d));
        },
        line() {
            return this.path(this.data);
        },
        viewBox() {
            return `0 0 ${this.width} ${this.height}`;
        },
    },
};
</script>

<style>
.line-chart {
    margin: 25px;
}

.line-chart.line {
    fill: none;
    stroke: #76bf8a;
    stroke-width: 3px;
}
</style>