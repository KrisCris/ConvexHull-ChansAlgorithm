<template>
    <div id="nav" class="top">
        <router-link :to="{ name: 'ChansAlg' }">Chan's Algorithm</router-link>
        <router-link :to="{ name: 'About' }">About </router-link>
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
    /* border-style: solid;
    border-color: #42b983;
    border-width: 0rem 0rem 0.05rem 0rem; */
    padding: 1.5rem 0rem;
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
    margin: 0rem 1rem;
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
.top{
    width: 100%;
    height:1.5rem;
    flex:none;
}
</style>