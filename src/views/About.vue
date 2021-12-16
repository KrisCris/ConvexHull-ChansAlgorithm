<template>
    <Nav></Nav>
    <div class="about">
        <h1>Description</h1>
        <p>
            This is my final project for the 
            <a target="_blank" rel="noopener noreferrer" href="https://www.cse.wustl.edu/~taoju/cse546/">CSE546: Computational Geometry</a> 
            course, taught by 
            <a target="_blank" rel="noopener noreferrer" href="https://www.cse.wustl.edu/~taoju/">Professor Tao Ju</a>, 
            at Washington University in St. Louis.
        </p>
        <p>
            It demos <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Chan%27s_algorithm">Chan's Algorithm</a>,
             an optimal output-sensitive algorithm computing the convex hull of a point set.
        </p>
        <h1>Developer</h1>
        <div class="devs">
            <p><a target="_blank" rel="noopener noreferrer" href="https://github.com/KrisCris">Pingchuan Huang</a></p>
            <p>Yong Chen</p>
        </div>
        <h1>Git Repo</h1>
        <div>
            <p><a target="_blank" rel="noopener noreferrer" href="https://github.com/KrisCris/ConvexHull-ChansAlgorithm">https://github.com/KrisCris/ConvexHull-ChansAlgorithm</a></p>
        </div>
        <h1>Tools</h1>
        <div class="tools">
            <p><a target="_blank" rel="noopener noreferrer" href="https://vuejs.org/">Vue.js</a></p>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/davidmerfield/randomColor"><p>randomColor</p></a>
        </div>
        <h1>References</h1>
        <div class="refs">
            <a target="_blank" rel="noopener noreferrer" href="https://sites.cs.ucsb.edu/~suri/cs235/ChanCH.pdf">
                <p>1. Chan, T.M. Optimal output-sensitive convex hull algorithms in two and three dimensions</p>
            </a>
            <a target="_blank" rel="noopener noreferrer" href="http://www.cs.umd.edu/~mount/754/Lects/754lects.pdf">
                <p>2. Dave Mount's Lecture Notes</p>
            </a>
        </div>

    </div>

</template>

<script>
import * as d3 from "d3";
import Nav from "../components/Nav.vue";

export default {
    name: "About",
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

.about {
    margin: 2rem 5rem;
}
</style>