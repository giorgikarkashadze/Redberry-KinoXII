import './assets/main.css'
import '@fontsource-variable/archivo'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import { useFilterOptionsStore } from '@/stores/filterOptions'

const app = createApp(App)

app.use(createPinia())
app.use(router)

useAuthStore().init()
useFilterOptionsStore().load()

app.mount('#app')
