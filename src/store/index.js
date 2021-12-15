import { createStore } from 'vuex'
import randomColor from 'randomcolor'
import Vertex from "../util/Vertex.js";
import Chans from "../util/Chans.js";

export default createStore({
    // data
    // $store.state.stateName
    // alternatively, computed -> getXXX() -> return this.$store.state.stateName
    // computed -> setXXX(val) -> this.$store.commit("mutationName", arg)
    state: {
        // Progress Control
        drawable: true,
        // 0: draw dots
        // 1: group them in different colors
        // 2: create sub CHs by GS alg, edges in different color
        // 3: 
        step: 0,


        // Geo Data
        rawVertices: [],
        groupedVertices: [],
        subHullEdges: [],
        fullHullEdges: []
    },
    // [commit] mutations
    // $store.commit('mutationName', {})
    mutations: {
        addVertex(state, pos) {
            state.rawVertices.push(new Vertex(pos.x, pos.y))
        },

        setEdges(state, edges) {
            state.subHullEdges = edges
        }

    },
    // [dispatch] action
    // $store.dispatch('actionName')
    // can access state but can't change state.
    // actions => commit mutation => change data
    actions: {
        // doSomething(context){context.commit()}
        grahamScan({ commit, state }) {
            let chans = Chans.getInstance(state.rawVertices);
            if (chans) {
                commit("setEdges", chans.Hull(state.rawVertices).edges)
                // console.log(this.edges);

                // console.log("test for bsearch:", chans.test());
            } else {
                alert("You had to add more dots!!!!");
            }
        }

    },
    // get data from state
    // $store.getters.getterName
    getters: {
        vertices(state) {
            switch (state.step) {
                case 0: {
                    return state.rawVertices
                    break
                }
                case 1: {
                    // do something
                    break
                }
                // case X...
            }
        },

        edges(state) {
            switch (state.step) {
                case 0: {
                    return state.subHullEdges
                    break
                }
                case 1: {
                    // do something
                    break
                }
                // case X...
            }
        },

        color({ state }) {
            return randomColor({ count: 1 })
        }
    },
    // break state into multiple
    modules: {

    }
})
