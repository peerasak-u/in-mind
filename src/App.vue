<!-- src/App.vue -->
<template>
    <div id="app">
        <div
            class="fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 py-2 px-2 bg-gray-600 rounded-r-lg shadow-lg z-40"
        >
            <router-link
                to="/ask-question"
                class="bg-gray-500 p-2 rounded hover:bg-gray-400 transition-colors duration-200"
            >
                <span class="text-gray-600 text-xl">🧠</span>
            </router-link>
            <router-link
                to="/english-assistant"
                class="bg-gray-500 p-2 rounded hover:bg-gray-400 transition-colors duration-200"
            >
                <span class="text-gray-600 text-xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            </router-link>
            <!-- Add more menu items here -->
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
}
</script>
