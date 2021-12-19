<template>
    <div class="row">
        <Nav></Nav>

        <div class="col">
            <SketchPad> </SketchPad>
            <ControlPanel> </ControlPanel>
        </div>
    </div>
</template>

<script>
import Nav from "../components/Nav.vue";
import SketchPad from "../components/Sketchpad.vue";
import ControlPanel from "../components/ControlPanel.vue";

export default {
    name: "ChansAlg",
    components: { Nav, SketchPad, ControlPanel },
    data() {
        return {};
    },

    mounted() {},
};
</script>

<style>
@media only screen and (max-width: 768px) {
    .row {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
    }
    .col {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}

@media only screen and (min-width: 768px) {
    .row {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
    }
    .col {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: row;
    }
}
</style>