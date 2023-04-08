import Vue from 'vue'
import VueRouter from 'vue-router'
import AskQuestion from '@/pages/AskQuestion.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/ask-question',
		name: 'AskQuestion',
		component: AskQuestion,
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
