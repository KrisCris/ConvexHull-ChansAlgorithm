<template>
    <router-view />
</template>
<script>
export default {
    name: "App",
    methods: {
        resizeWatcher() {
            clearTimeout(this.$store.state.resizeTimeoutId);
            this.$store.state.resizeTimeoutId = setTimeout(() => {
                const svg = document.getElementById("svg");
                if (svg == undefined) {
                    this.$store.state.resizeRequired = true;
                    return;
                }
                const rect = svg.getBoundingClientRect()
                this.$store.commit("updatePosition", { width: rect.width, height: rect.height });
            }, 500)
        }
    },
    mounted() {
        window.addEventListener("resize", this.resizeWatcher);
    },

    unmounted() {
        window.removeEventListener("resize", this.resizeWatcher);
    }
};
</script>
<style>
body {
    background: #1e1f22;
    margin: 0px auto;
    padding: 0px;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

a {
    text-decoration: none;
    color: #13ffeb;
}

p {
    color: #64ff8d;
    font-weight: bold;
    text-align: left;
}

h1,
h2 {
    margin: 0px 0px 0px 0px;
    color: #7fd496;
    text-align: left;
    border-bottom: solid;
}

h3,
h4,
h5 {
    margin: 1rem 0px 0px 0px;
    color: #7fd496;
    text-align: left;
    border-left: solid;
    padding-left: 0.5rem;
}

button {
    box-shadow: #2b2b2b34 2px 2px 8px;
}

button:hover {
    box-shadow: #2b2b2b91 2px 2px 8px;
}</style>
