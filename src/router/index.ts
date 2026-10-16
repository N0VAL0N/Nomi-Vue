import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/study', name: 'study', component: () => import('@/views/StudyView.vue') },
    { path: '/nomi', name: 'nomi', component: () => import('@/views/NomiView.vue') },
    { path: '/topics', name: 'topics', component: () => import('@/views/TopicsView.vue') },
    { path: '/topics/:id', name: 'topic', component: () => import('@/views/TopicDetailView.vue') },
    { path: '/hw', name: 'hw', component: () => import('@/views/HwView.vue') },
    { path: '/checklist', name: 'checklist', component: () => import('@/views/ChecklistView.vue') },
    { path: '/schedule', name: 'schedule', component: () => import('@/views/ScheduleView.vue') },
    { path: '/timer', name: 'timer', component: () => import('@/views/TimerView.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
    { path: '/shop', name: 'shop', component: () => import('@/views/ShopView.vue') },
    { path: '/stats', name: 'stats', component: () => import('@/views/StatsView.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
    { path: '/pet', name: 'pet', component: () => import('@/views/PetView.vue') },
    { path: '/tools', name: 'tools', component: () => import('@/views/ToolsView.vue') },
    { path: '/quests', name: 'quests', component: () => import('@/views/QuestsView.vue') },
    { path: '/flash', name: 'flash', component: () => import('@/views/FlashView.vue') },
    { path: '/fridge', name: 'fridge', component: () => import('@/views/FridgeView.vue') },
    { path: '/errors', name: 'errors', component: () => import('@/views/ErrorDiaryView.vue') },
    { path: '/plan', name: 'plan', component: () => import('@/views/PlanView.vue') },
    { path: '/advice', name: 'advice', component: () => import('@/views/SmartAdviceView.vue') },
    { path: '/notes', name: 'notes', component: () => import('@/views/NotesView.vue') },
  ]
})

export default router