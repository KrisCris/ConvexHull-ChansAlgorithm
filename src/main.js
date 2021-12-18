import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
library.add(faCog)
app.use(store)
app.use(router)

app.mount('#app')
