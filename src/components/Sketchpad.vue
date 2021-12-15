<template>
    <div class="sketchpad">
        <svg id="svg" width="100%" height="100%" @click="addPoint">
            
                <circle  v-for="v in vertices" :key="v" :cx="v.xPos" :cy="v.yPos" r="5"></circle>
                <line x1="0" y1="0" x2="200" y2="200"></line>
                <line v-for="e in edges" :key="e" :x1="e[0].xPos" :x2="e[1].xPos" :y1="e[0].yPos" :y2="e[1].yPos"></line>
        </svg>
        <button @click="grahamScan">grahamScan</button>
    </div>
</template>

<script>
import * as d3 from "d3";
import Vertex from '../util/Vertex.js'
import Chans from '../util/Chans.js'
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
            let ch = Chans.grahamScan(this.vertices)
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
    stroke: lightgreen; stroke-width: 10;
}
</style>