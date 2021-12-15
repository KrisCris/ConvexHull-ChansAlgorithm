<template>
    <div class="sketchpad">
        <svg id="svg" width="100%" height="100%" @click="addPoint">
                <circle  v-for="v in vertices" :key="v" :cx="v.xPos" :cy="v.yPos" r="5"></circle>
                <line v-for="e in edges" :key="e" :x1="e.x0" :x2="e.x1" :y1="e.y0" :y2="e.y1"></line>
        </svg>
        <button @click="grahamScan">grahamScan</button>
    </div>
</template>

<script>
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
            // console.log(this.vertices)
        },
        grahamScan(){
            let chans = Chans.getInstance(this.vertices)
            if(chans){
                this.edges = chans.GrahamScan(this.vertices).edges
                console.log(this.edges)

                console.log("test for bsearch:", chans.test())
            } else {
                alert("You had to add more dots!!!!")
            }

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