<template>
    <div id="nav">
        <router-link :to="{ name: 'ChanAlg' }">Chan's Algorithm</router-link>
        <router-link :to="{ name: 'Test' }">Test </router-link>
    </div>
</template>

<script>
export default {
    name: "Nav",
    methods: {

    },
};
</script>

<style>
#nav {
    padding: 3rem;
}
#nav span{
    color:white;
}
#nav a {
    font-weight: bold;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 1rem;
    margin: 1rem;
    background: rgb(48, 45, 45);
    transition: all 0.3s ease-in-out;
}
#nav a.router-link-exact-active {
    color: white;
    background: #42b983;
    transition: all 0.3s ease-in-out;
}
#nav a:hover{
    filter: brightness(120%);
    transition: all 0.3s ease-in-out;
    box-shadow: #2c2c2c 5px 5px 1rem;
}
</style>