import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home'
import welcome from '../components/welcome'
import user from '../components/user/user'
import search from '@/components/search/search'
import dataset from '@/components/dataset/dataset'
import supervice from '@/components/supervice/supervice'
import record from '@/components/record/record'
import datasetinfo from '@/components/dataset/datasetinfo'
import datasetlist from '@/components/dataset/datasetlist'
import scene from '@/components/categorise/scene'
import classcification from '@/components/categorise/classcification'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/user', component: user },
        { path: '/search', component: search },
        { path: '/dataset', component: dataset },
        { path: '/supervice', component: supervice },
        { path: '/record', component: record },
        { path: '/datasetinfo', component: datasetinfo },
        { path: '/datasetlist', component: datasetlist },
        { path: '/scene', component: scene },
        { path: '/classcification', component: classcification }
      ]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to代表将要访问的路径
  // from代表从哪个路径跳转而来
  // next代表一个函数表示放行，next()代表放行，next('/login)表示强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
