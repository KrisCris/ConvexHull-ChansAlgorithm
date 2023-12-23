<template>
    <div id="nav" class="top">
        <router-link :to="{ name: 'Chans' }">Chan's Algorithm</router-link>
        <router-link :to="{ name: 'About' }">About </router-link>
        <a id="settingsBtn" class="settingsBtn" href="#" @click="settings = !settings" v-if="isPadPage">&#x2699;</a>
        <div id="settingsPanel" v-if="settings" class="settings" :style="{ top: top() + 'px', right: right() + 'px' }">
            <p>Animation Duration ({{ speed }} ms)</p>
            <input type="range" v-model="speed" min="10" max="200" step="10">
        </div>
    </div>
</template>

<script>
export default {
    name: "Nav",
    mounted() {
        document.addEventListener('click', this.disableSettings);
    },
    methods: {
        top() {
            return document.querySelector('#nav').clientHeight + 5
        },
        right() {
            return window.innerWidth - document.querySelector('.settingsBtn').offsetLeft - document.querySelector('.settingsBtn').offsetWidth / 2
        },
        disableSettings(event) {
            const settingsPanel = document.querySelector('#settingsPanel');
            const settingsBtn = document.querySelector('#settingsBtn');
            if (settingsPanel && !settingsPanel.contains(event.target) && !settingsBtn.contains(event.target)) {
                this.settings = false;
            }
        }
    },
    data() {
        return {
            settings: false
        }
    },
    computed: {
        speed: {
            get() {
                return this.$store.state.speed;
            },
            set(value) {
                this.$store.commit("setSpeed", value);
            },
        },
        isPadPage() {
            return this.$route.name === "Chans";
        },
    }
};
</script>

<style>
.top {
    box-shadow: 0px 5px 5px #141414;
    z-index: 1;
}

#nav {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* #nav * {
    flex: 1;
} */

#nav a {
    display: inline-block;
}

#nav span {
    color: white;
}

#nav a.router-link-exact-active {
    color: white;
    background: #42b983;
    transition: all 0.3s ease-in-out;
}

#nav a:hover {
    filter: brightness(120%);
    transition: all 0.3s ease-in-out;
    box-shadow: #2b2b2b 2px 2px 10px;
}

#nav .settingsBtn {
    flex-grow: 0;
    flex-shrink: 0;
}

.settings {
    padding: 10px;
    z-index: 99;
    position: fixed;
    width: 14rem;
    height: 4rem;
    background-color: rgb(48, 45, 45);
    border-radius: 1rem;
    box-shadow: #2c2c2c 5px 5px 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.settings p {
    color: white;
    text-align: center;
    margin: 0px;
    padding: 0px;
    margin-bottom: 0.5rem;
}

.settings input {
    margin: 0.3rem;
    padding: 0px;
}

@media only screen and (max-width: 992px) {
    #nav {
        padding: 0.7rem 0rem;
    }

    #nav a {
        font-weight: bold;
        color: white;
        text-decoration: none;
        padding: 0.3rem 1rem;
        border-radius: 0.5rem;
        margin: 0rem 0.5rem;
        background: rgb(48, 45, 45);
        transition: all 0.3s ease-in-out;
    }

    .top {
        width: 100%;
        height: 1.3rem;
        flex: none;
    }
}

@media only screen and (min-width: 992px) {
    #nav {
        padding: 1.1rem 0rem;
    }

    #nav a {
        font-weight: bold;
        color: white;
        text-decoration: none;
        padding: 0.8rem 2rem;
        border-radius: 0.8rem;
        margin: 0rem 1rem;
        background: rgb(48, 45, 45);
        transition: all 0.3s ease-in-out;
    }

    .top {
        width: 100%;
        height: 1.35rem;
        flex: none;
    }
}

@media only screen and (min-width: 1200px) {
    #nav {
        padding: 1.5rem 0rem;
    }

    #nav a {
        font-weight: bold;
        color: white;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 1rem;
        margin: 0rem 1rem;
        background: rgb(48, 45, 45);
        transition: all 0.3s ease-in-out;
    }

    .top {
        width: 100%;
        height: 1.5rem;
        flex: none;
    }
}</style>