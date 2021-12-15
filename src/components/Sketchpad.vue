<template>
    <div class="sketchpad">
        <svg id="svg" width="100%" height="100%" @click="addPoint">
            
                <circle  v-for="v in vertices" :key="v" :cx="v.xPos" :cy="v.yPos" r="5"></circle>
                <!-- <line x1="0" y1="0" x2="200" y2="200"></line> -->
                <line v-for="e in edges" :key="e" :x1="e.x0" :x2="e.x1" :y1="e.y0" :y2="e.y1"></line>
        </svg>
        <button @click="grahamScan">grahamScan</button>
    </div>
</template>

<script>
import * as d3 from "d3";
import Vertex from '../util/Vertex.js'
import Chans from '../util/Chans.js'
import Edge from '../util/Edge.js'
export default {
    name: "Sketchpad",
    data() {
        return {
            vertices:[],
            edges:[]
        };
    },
    methods:{
        addPoint(e){
            this.vertices.push(new Vertex(e.offsetX, e.offsetY))
            console.log(this.vertices)
        },
        grahamScan(){
            this.edges = Chans.GrahamScan(this.vertices).edges
        }
    },
    mounted(){
    }
};
</script>

<style>
.sketchpad {
    height: 100%;
    background-color: lightBlue;
    flex: 1;
}
circle {
    fill: steelblue
}
line{
    stroke: rgb(0, 94, 62); stroke-width: 3;
}
</style>