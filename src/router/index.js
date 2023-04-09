import Vue from 'vue'
import VueRouter from 'vue-router'
import AskQuestion from '@/pages/AskQuestion.vue'
import EnglishAssistant from '@/pages/EnglishAssistant.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/ask-question',
		name: 'AskQuestion',
		component: AskQuestion,
	},
	{
		path: '/english-assistant',
		name: 'EnglishAssistant',
		component: EnglishAssistant,
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
