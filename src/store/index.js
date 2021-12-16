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
        fullHullEdges: [],
        scanEdge: undefined,

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
            if (state.step != 1 && state.step != 4) return
            for (let d of state.rawVertices)
                if (d.xPos == pos.x && d.yPos == pos.y)
                    return

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

        setM(state, val) {
            state.m = val
        }

    },
    // [dispatch] action
    // $store.dispatch('actionName')
    // can access state but can't change state.
    // actions => commit mutation => change data
    actions: {
        nextStep({ commit, state, dispatch }) {
            if (state.step == 2) {
                dispatch("computeChans")
            }
            if (state.step == 3) {
                for (let v of state.rawVertices) {
                    v.color = "#74ff99"
                }
                state.subStep = 0;
                state.round = 0;
                state.fullHullEdges = [];
                state.subHullEdges = [];
                state.rawResults = [];
            }
            commit("updateStep", 1)
        },

        prevStep({ commit, state }) {
            if (state.step - 1 == 0) {
                commit("restart")
            } else {
                commit("updateStep", -1)
            }
        },


        addPoints({ commit, state }, payload) {
            commit("updateCanRun", false)
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }

            let count = payload.number
            let interval = setInterval(() => {
                if (count > 0) {
                    let len = state.rawVertices.length
                    commit("addVertex", {
                        x: getRandomInt(6, payload.maxX - 5),
                        y: getRandomInt(6, payload.maxY)
                    })
                    let len2 = state.rawVertices.length
                    while (len == len2) {
                        commit("addVertex", {
                            x: getRandomInt(6, payload.maxX - 5),
                            y: getRandomInt(6, payload.maxY)
                        })
                        len2 = state.rawVertices.length
                    }

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
                alert("You have to add more dots!!!!");
            }
        },

        groupPoints({ state, commit }, callback = undefined) {
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
                    if (callback) callback()
                    commit("updateCanRun", true)
                }
            }, 20)
            commit("nextSubStep")
        },

        grahamScan({ state, commit }, callback = undefined) {
            commit("updateCanRun", false)
            let count = state.rawResults[state.round].edgeLen
            let grp = 0
            let idx = 0
            state.subHullEdges = []
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
                    if (callback) callback()
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
            state.fullHullEdges = []
            // let count = mScans.length * state.rawResults[state.round].r
            let count = 0
            for (let s of mScans) {
                count += s.length
            }

            let grp = 0
            let idx = 0
            let interval = setInterval(() => {
                if (count > 0) {
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
                    clearInterval(interval)
                    commit("setScanEdge", undefined)
                    commit("updateCanRun", true)
                }
            }, 20)

            commit("nextSubStep")
        },

        mChans({ commit, state, dispatch }) {
            let inst = Chans.getInstance(state.rawVertices);
            if (inst) {
                commit("setResults", inst.mHull(state.m))
                for (let v of state.rawVertices) {
                    v.color = "#74ff99"
                }
                state.fullHullEdges = []
                state.subHullEdges = []
                dispatch("groupPoints", () => { dispatch('grahamScan', () => { dispatch('jarvisMarch') }) })
                state.subStep = 0;
                state.round = 0;
            } else {
                alert("You have to add more dots!!!!");
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
