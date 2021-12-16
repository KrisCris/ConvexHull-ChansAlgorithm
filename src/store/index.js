import { createStore } from 'vuex'
import randomColor from 'randomcolor'
import Vertex from "../util/Vertex.js";
import Chans from "../util/Chans.js";
import Edge from '../util/Edge.js';

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
        fullHullEdges: [],
        m: 6
    },
    // [commit] mutations
    // $store.commit('mutationName', {})
    mutations: {
        nextStep(state) {
            state.step += 1
        },

        prevStep(state) {
            state.step -= 1
        },

        addVertex(state, pos) {
            if(state.step == 0) return
            state.rawVertices.push(new Vertex(pos.x, pos.y))
        },

        setEdges(state, edges) {
            state.subHullEdges = edges
        },

        maxAngle(state) {
            let inst = Chans.getInstance(state.rawVertices)
            let b = inst.P[0]
            for (let d of inst.P) {
                if (d.yPos < b.yPos) {
                    b = d
                }
            }
            let a = new Vertex(Number.MIN_SAFE_INTEGER, 0)
            // let a = state.rawVertices[state.rawVertices.length - 2]
            // let b = state.rawVertices[state.rawVertices.length - 1]
            // let testSet = state.rawVertices.slice(0, state.rawVertices.length - 2)
            let res = inst.GrahamScan(state.rawVertices)
            state.subHullEdges = res.edges
            // let idx = res.vertices.indexOf(b)
            // res.vertices.splice(idx, 1);

            let r = inst.bSearch(res.vertices, 0, res.vertices.length - 1, a, b)
            state.subHullEdges.push(new Edge(a, b, "rebeccapurple"))
            state.subHullEdges.push(new Edge(b, r, "red"))
        },

        partialGH(state) {
            let inst = Chans.getInstance(state.rawVertices)
            let ret = inst.testPartialGH(state.m)
            state.rawVertices = []
            state.subHullEdges = []
            let r = Math.ceil(inst.P.length / state.m)
            let colors = randomColor({ count: r })
            for (let i = 0; i < r; i++) {
                for (let v of ret[0][i]) {
                    v.color = colors[i]
                    state.rawVertices.push(v)
                }
            }
            for (let i = 0; i < r; i++) {
                for (let e of ret[1][i].edges) {
                    e.color = colors[i]
                    state.subHullEdges.push(e)
                }
            }
        },

        setM(state, val) {
            state.m = val
            console.log("boopm")
        }

    },
    // [dispatch] action
    // $store.dispatch('actionName')
    // can access state but can't change state.
    // actions => commit mutation => change data
    actions: {
        addPoints({ commit }, payload) {
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }

            let count = payload.number
            let interval = setInterval(() => {
                if (count > 0) {
                    commit("addVertex", {
                        x: getRandomInt(6, payload.maxX-5),
                        y: getRandomInt(6, payload.maxY)
                    })
                    count--;
                } else {
                    clearInterval(interval)
                }
            }, 50)
        },



        // doSomething(context){context.commit()}
        chans({ commit, state }) {

            let inst = Chans.getInstance(state.rawVertices);
            if (inst) {
                // run Hull()
                let ret = inst.Hull()

                state.subHullEdges = []
                state.rawVertices = []
                let colors = randomColor({ count: ret.r })

                for (let i = 0; i < ret.r; i++) {
                    for (let v of ret.subP[i]) {
                        v.color = colors[i]
                        state.rawVertices.push(v)
                    }
                }
                for (let i = 0; i < ret.r; i++) {
                    for (let e of ret.subCH[i].edges) {
                        e.color = colors[i]
                        state.subHullEdges.push(e)
                    }
                }
                console.log(ret.edges)
                state.subHullEdges = state.subHullEdges.concat(ret.edges)
            } else {
                alert("You had to add more dots!!!!");
            }
        },

        chansM({ commit, state }) {

            let inst = Chans.getInstance(state.rawVertices);
            if (inst) {
                // run Hull()
                let r = Math.ceil(inst.P.length / state.m)
                let ret = inst.mChans(state.m)

                state.subHullEdges = []
                state.rawVertices = []
                let colors = randomColor({ count: r })

                for (let i = 0; i < r; i++) {
                    for (let v of ret.subP[i]) {
                        v.color = colors[i]
                        state.rawVertices.push(v)
                    }
                }
                for (let i = 0; i < r; i++) {
                    for (let e of ret.subCH[i].edges) {
                        e.color = colors[i]
                        state.subHullEdges.push(e)
                    }
                }
                console.log(ret.edges)
                state.subHullEdges = state.subHullEdges.concat(ret.edges)
            } else {
                alert("You had to add more dots!!!!");
            }
        },


    },
    // get data from state
    // $store.getters.getterName
    getters: {
        vertices(state) {
            switch (state.step) {
                case 0: {
                    break
                }
                case 1: {
                    // do something
                    return state.rawVertices
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
    },

    // break state into multiple
    modules: {

    }
})
