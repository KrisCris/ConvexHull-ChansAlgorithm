<template>
    <div id="nav" class="top">
        <router-link :to="{ name: 'ChansAlg' }">Chan's Algorithm</router-link>
        <router-link :to="{ name: 'About' }">About </router-link>
    </div>
</template>

<script>
export default {
    name: "Nav",
    methods: {},
};
</script>

<style>
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
    box-shadow: #2c2c2c 5px 5px 1rem;
}

@media only screen and (max-width: 600px) {
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

@media only screen and (min-width: 600px) {
    #nav {
        padding: 1rem 0rem;
    }

    #nav a {
        font-weight: bold;
        color: white;
        text-decoration: none;
        padding: 0.6rem 2rem;
        border-radius: 0.6rem;
        margin: 0rem 1rem;
        background: rgb(48, 45, 45);
        transition: all 0.3s ease-in-out;
    }
    .top {
        width: 100%;
        height: 1.4rem;
        flex: none;
    }
}

/* Large devices (laptops/desktops, 992px and up) */
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

/* Extra large devices (large laptops and desktops, 1200px and up) */
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
}
</style>