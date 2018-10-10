import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import NotFound from './components/Common/NotFound'
import Home from './components/Home/Home'
import InfoShow from './components/InfoShow/InfoShow'
import FundList from './components/FundList/FundList'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home },
        { path: '/infoshow', name: 'infoshow', component: InfoShow },
        { path: '/fundlist', name: 'fundlist', component: FundList },
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})

router.beforeEach(function (to, from, next) {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    isLogin ? next() : next({ name: 'login' });
  }
})

export default router