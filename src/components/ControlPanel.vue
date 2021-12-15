<template>
<div class="ControlPanel">
<button @click="grahamScan">GrahamScan</button>
</div>
</template>

<script>

export default {
    name: "ControlPanel",
    methods:{
        grahamScan(){
            this.$store.dispatch("grahamScan")
        }
    }
};
</script>

<style>
.ControlPanel{
    height: 100%;
    width: 22rem;
    flex: none;
    background: rebeccapurple;
}
</style>