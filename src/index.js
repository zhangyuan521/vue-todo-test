import Vue from 'vue'
import App from './app.vue'
import './asset/styles/global.stylus'
const root = document.createElement('div')
document.body.appendChild(root)
 new Vue({
   render:(h)=>h(App)
 }).$mount(root) 