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
            <p><a target="_blank" rel="noopener noreferrer" href="https://github.com/CocoYard">Yong Cheng</a></p>
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
import Nav from "../components/Nav.vue";

export default {
    name: "About",
    components: { Nav },
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