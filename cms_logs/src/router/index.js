import Vue from "vue"
import VueRouter from 'vue-router'
import Login from '../views/Login'
//import Cmslogs from '../views/cms/Cmslogs'
import CmslogAdd from '../views/cms/CmslogAdd'
import CmslogTable from '../views/cms/CmslogTable'
import Home from '../views/home/Home'
import Welcome from "../views/welcome/Welcome"




// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,

  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,

      },
      // {
      //   path: '/cmslogs',
      //   component: Cmslogs,

      // },
      {
        path: '/cmslogadd',
        component: CmslogAdd,

      },
      {
        path: '/cmslogquery',
        component: CmslogTable,

      },

    ],


  },

];


const router = new VueRouter({
  // mode: 'history',
  routes
})

//路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    return next();
  }
  var token = window.sessionStorage.getItem("token");
  if (!token) {
    return next({ path: "/login" })
  }

  next();

});


export default router;