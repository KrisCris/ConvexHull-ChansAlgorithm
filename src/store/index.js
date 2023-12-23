import { createStore } from 'vuex'
import distinctColors from 'distinct-colors'
import Vertex from "../util/Vertex.js";
import Chans from "../util/Chans.js";
import Edge from '../util/Edge.js';
import sleep from '../util/util.js'

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
        speed: 40,

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
        setSpeed(state, val) {
            state.speed = val
        },

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
                res.colors = distinctColors({
                    count: res.r,
                    chromaMin: 50,
                    lightMin: 45
                });
            }
            state.rawResults = results
        },

        nextRound(state, callback = undefined) {
            for (let v of state.rawVertices) {
                v.color = Vertex.DefaultColor
            }
            state.subStep = 0;
            state.fullHullEdges = [];
            state.subHullEdges = [];
            state.round += 1;
            if (callback) callback()

        },

        prepRunAgain(state, callback = undefined) {
            for (let v of state.rawVertices) {
                v.color = Vertex.DefaultColor
            }
            state.subStep = 0;
            state.round = 0
            state.fullHullEdges = [];
            state.subHullEdges = [];
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
                    v.color = Vertex.DefaultColor
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


        async addPoints({ commit, state }, payload) {
            const points_radius = 5
            commit("updateCanRun", false)
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }

            let count = payload.number
            while (count > 0) {
                commit("addVertex", {
                    x: getRandomInt(points_radius, payload.maxX - points_radius),
                    y: getRandomInt(points_radius, payload.maxY - points_radius)
                })
                await sleep(state.speed);
                count--;
            }
            commit("updateCanRun", true)
        },

        computeChans({ state, commit }) {
            let inst = Chans.getInstance(state.rawVertices);
            if (inst) {
                commit("setResults", inst.Hull())
            } else {
                alert("You have to add more dots!!!!");
            }
        },

        async groupPoints({ state, commit }, callback = undefined) {
            commit("updateCanRun", false)
            let count = state.rawResults[state.round].pLen
            let grp = 0
            let idx = 0
            while (count > 0) {
                let color = state.rawResults[state.round].colors[grp]
                state.rawResults[state.round].subP[grp][idx].color = color
                if (state.rawResults[state.round].subP[grp].length - 1 > idx) {
                    idx++
                } else {
                    idx = 0
                    grp++
                }
                count--;
                await sleep(state.speed)
            }
            commit("nextSubStep")
            if (callback)
                setTimeout(() => { callback() }, 500)
            else
                commit("updateCanRun", true)
        },

        async grahamScan({ state, commit }, callback = undefined) {
            commit("updateCanRun", false)
            let count = state.rawResults[state.round].edgeLen
            let grp = 0
            let idx = 0
            state.subHullEdges = []
            while (count > 0) {
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
                await sleep(state.speed)
            }
            commit("nextSubStep")
            if (callback)
                setTimeout(() => { callback() }, 500)
            else
                commit("updateCanRun", true)
        },

        async jarvisMarch({ state, commit }, callback = undefined) {
            commit("updateCanRun", false);
            let mScans = state.rawResults[state.round].JM.mScans;
            let mVertices = state.rawResults[state.round].JM.mVertices;
            state.fullHullEdges = []
            let count = 0
            for (let s of mScans) {
                count += s.length
            }
            let grp = 0
            let idx = 0
            while (count > 0) {
                let e = new Edge(mVertices[grp], mScans[grp][idx])
                commit("setScanEdge", e)
                // init local largest angle edge
                if (idx == 0) {
                    e.color = "#FF0051"
                    commit("addFullHullEdge", e)
                } else {
                    let lastPoint = (grp == 0) ? new Vertex(Number.MIN_SAFE_INTEGER, 0) : state.fullHullEdges[state.fullHullEdges.length - 2].begin
                    let old = Vertex.degree(lastPoint, state.fullHullEdges[state.fullHullEdges.length - 1].begin, state.fullHullEdges[state.fullHullEdges.length - 1].end)
                    let cur = Vertex.degree(lastPoint, e.begin, e.end)
                    if (cur > old) {
                        e.color = "#FF0051"
                        commit("replaceLastFullHullEdge", e)
                    }
                }
                if (mScans[grp].length - 1 > idx) {
                    idx++
                } else {
                    state.fullHullEdges[state.fullHullEdges.length - 1].color = "white"
                    idx = 0
                    grp++
                }
                count--;
                await sleep(state.speed)
            }
            commit("setScanEdge", undefined)
            commit("nextSubStep")
            if (callback && state.rawResults.length - 1 > state.round) {
                setTimeout(() => { callback() }, 500)
            } else {
                commit("updateCanRun", true)
            }
        },

        mChans({ commit, state, dispatch }) {
            let inst = Chans.getInstance(state.rawVertices);
            if (inst) {
                commit("setResults", inst.mHull(state.m))
                for (let v of state.rawVertices) {
                    v.color = Vertex.DefaultColor
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

        auto({ commit, state, dispatch }, oneRound = false) {
            switch (state.subStep) {
                case 0: {
                    dispatch("groupPoints", () => { dispatch('grahamScan', () => { dispatch('jarvisMarch', () => { commit('nextRound', () => { if (!oneRound) dispatch('auto', oneRound) }) }) }) })
                    break
                }
                case 1: {
                    dispatch('grahamScan', () => { dispatch('jarvisMarch', () => { commit('nextRound', () => { if (!oneRound) dispatch('auto', oneRound) }) }) })
                    break
                }
                case 2: {
                    dispatch('jarvisMarch', () => { commit('nextRound', () => { if (!oneRound) dispatch('auto', oneRound) }) })
                    break
                }
                case 3: {
                    commit('nextRound', () => { if (!oneRound) dispatch('auto', oneRound) })
                    break
                }
            }
        }


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
