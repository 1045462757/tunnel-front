import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/components/general/Main'
import About from '@/components/general/About'
import AddTunnel from '@/components/tunnel/AddTunnel'

import Index from '@/components/tunnel/Index'
import ModifyTunnel from '@/components/tunnel/ModifyTunnel'

import TunnelDetails from "@/components/tunnel/TunnelDetails"
import TunnelList from "@/components/tunnel/TunnelList"

import MonList from "@/components/monp/MonList"
import AddMon from "@/components/monp/AddMon"
import ModifyMon from "@/components/monp/ModifyMon"
import MonDetails from "@/components/monp/MonDetails"
import MonParse from "@/components/monp/MonParse"

import Login from "@/components/general/Login"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      meta: {
        requireAuth: true
      },
      children: [{
        path: 'addTunnel',
        component: AddTunnel,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'modifyTunnel',
        component: ModifyTunnel,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'tunnelDetails',
        component: TunnelDetails,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'tunnelList',
        component: TunnelList,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'monList',
        component: MonList,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'addMon',
        component: AddMon,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'modifyMon',
        component: ModifyMon,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'monDetails',
        component: MonDetails,
        meta: {
          requireAuth: true
        }
      }, {
        path: 'monParse',
        component: MonParse,
        meta: {
          requireAuth: true
        }
      }]
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    }
  ]
})
