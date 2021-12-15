import { createStore } from 'vuex'

export default createStore({
    // data
    // $store.state.stateName
    // alternatively, computed -> getXXX() -> return this.$store.state.stateName
    // computed -> setXXX(val) -> this.$store.commit("mutationName", arg)
    state: {
    },
    // [commit] mutations
    // $store.commit('mutationName', {})
    mutations: {
  },
    // [dispatch] action
    // $store.dispatch('actionName')
    // can access state but can't change state.
    // actions => commit mutation => change data
    actions: {
    },
    // get data from state
    // $store.getters.getterName
    getters: {
    },
    // break state into multiple
    modules: {
    }
})
