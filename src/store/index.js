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
        // 0: Welcome Page
        // 1: Draw Points
        // 2: Division on manipulate m and try demo
        // 3: Try Demo
        step: 0,
        canRun: true,

        // which round of m is currently in
        round: 0,
        subStep: 0,


        // Geo Data
        rawVertices: [],
        rawResults: [],
        subHullEdges: [],

        // groupedVertices: [],
        scanEdge: undefined,
        fullHullEdges: [],
        m: 6
    },
    // [commit] mutations
    // $store.commit('mutationName', {})
    mutations: {
        updateStep(state, value) {
            state.step += value
        },

        updateCanRun(state, predicate) {
            state.canRun = predicate
        },

        nextRound(state) {
            state.round++
        },

        nextSubStep(state) {
            state.subStep++
        },

        addVertex(state, pos) {
            if (state.step != 1) return
            state.rawVertices.push(new Vertex(pos.x, pos.y))
        },

        addEdge(state, edge) {
            state.subHullEdges.push(edge)
        },

        setEdges(state, edges) {
            state.subHullEdges = edges
        },

        setScanEdge(state, edge) {
            state.scanEdge = edge
        },

        addFullHullEdge(state, edge) {
            state.fullHullEdges.push(edge)
        },

        replaceLastFullHullEdge(state, edge) {
            state.fullHullEdges[state.fullHullEdges.length - 1] = edge
        },

        setResults(state, results) {
            for (let res of results) {
                res.colors = randomColor({ count: res.r })
            }
            state.rawResults = results
        },

        nextRound(state) {
            for (let v of state.rawVertices) {
                v.color = "#74ff99"
            }
            state.subStep = 0;
            state.round += 1;
            state.fullHullEdges = []
            state.subHullEdges = []
        },

        restart(state) {
            state.rawVertices = [];
            state.rawResults = [];
            state.subStep = 0;
            state.round = 0;
            state.step = 0;
            state.fullHullEdges = [];
            state.subHullEdges = [];
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
        nextStep({ commit, state, dispatch }) {
            if(state.step == 2){
                dispatch("computeChans")
            }
            commit("updateStep", 1)
        },

        prevStep({ commit, state }) {
            switch (state.step) {

            }

            commit("updateStep", -1)
        },


        addPoints({ commit }, payload) {
            commit("updateCanRun", false)
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }

            let count = payload.number
            let interval = setInterval(() => {
                if (count > 0) {
                    commit("addVertex", {
                        x: getRandomInt(6, payload.maxX - 5),
                        y: getRandomInt(6, payload.maxY)
                    })
                    count--;
                } else {
                    clearInterval(interval)
                    commit("updateCanRun", true)
                }
            }, 20)
        },

        computeChans({ state, commit }) {
            let inst = Chans.getInstance(state.rawVertices);
            if (inst) {
                commit("setResults", inst.Hull())
                console.log(state.rawResults)
            } else {
                alert("You had to add more dots!!!!");
            }
        },

        groupPoints({ state, commit }) {
            commit("updateCanRun", false)
            let count = state.rawResults[state.round].pLen
            let grp = 0
            let idx = 0
            let interval = setInterval(() => {
                if (count > 0) {
                    let color = state.rawResults[state.round].colors[grp]
                    state.rawResults[state.round].subP[grp][idx].color = color
                    if (state.rawResults[state.round].subP[grp].length - 1 > idx) {
                        idx++
                    } else {
                        idx = 0
                        grp++
                    }
                    count--;
                } else {
                    clearInterval(interval)
                    commit("updateCanRun", true)
                }
            }, 20)
            commit("nextSubStep")
        },

        grahamScan({ state, commit }) {
            commit("updateCanRun", false)
            let count = state.rawResults[state.round].edgeLen
            let grp = 0
            let idx = 0
            let interval = setInterval(() => {
                if (count > 0) {
                    let color = state.rawResults[state.round].colors[grp]
                    state.rawResults[state.round].subCH[grp].edges[idx].color = color
                    commit("addEdge", state.rawResults[state.round].subCH[grp].edges[idx])
                    if (state.rawResults[state.round].subCH[grp].edges.length - 1 > idx) {
                        idx++
                    } else {
                        idx = 0
                        grp++
                    }
                    count--;
                } else {
                    clearInterval(interval)
                    commit("updateCanRun", true)
                }
            }, 20)

            commit("nextSubStep")

        },

        jarvisMarch({ state, commit }) {
            commit("updateCanRun", false);
            let mEdges = state.rawResults[state.round].JM.mEdges;
            let mScans = state.rawResults[state.round].JM.mScans;
            let mVertices = state.rawResults[state.round].JM.mVertices;

            let count = mScans.length * state.rawResults[state.round].r
            let grp = 0
            let idx = 0
            let interval = setInterval(() => {
                if (count > 0) {
                    if (mVertices[grp].xPos != undefined && mScans[grp][idx].xPos != undefined) {
                        let e = new Edge(mVertices[grp], mScans[grp][idx])
                        commit("setScanEdge", e)
                        // the largest edge
                        if (mScans[grp][idx] == mVertices[grp + 1]) {
                            commit("addFullHullEdge", e)
                        }
                        if (mScans[grp].length - 1 > idx) {
                            idx++
                        } else {
                            idx = 0
                            grp++
                        }
                        count--;
                    } else {
                        console.log("error", mVertices[grp], mScans[grp][idx].xPos)
                        count==0
                    }
                } else {
                    clearInterval(interval)
                    commit("setScanEdge", undefined)
                    commit("updateCanRun", true)
                }
            }, 20)

            commit("nextSubStep")
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
            if (state.step == 0) return []
            return state.rawVertices
        },

        edges(state) {
            if (state.step == 0) return []
            return state.subHullEdges
        },
    },

    // break state into multiple
    modules: {

    }
})
