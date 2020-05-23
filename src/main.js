import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * 插件
 * vue-cropper：图片裁剪
 * vue-particles：粒子效果
 */
import VueCropper from 'vue-cropper'
import VueParticles from 'vue-particles'

Vue.use(ElementUI, { locale })
Vue.use(VueCropper)
Vue.use(VueParticles)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
