<template>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 font-robotoMono">
        <div class="relative w-full sm:w-3/4 sm:mx-auto">
            <div class="container mb-8 text-center text-5xl">
                <h1>in<span class="text-orange-600">English</span></h1>
            </div>
            <div class="relative px-4 bg-white mx-8 md:mx-0 shadow rounded-3xl p-4 sm:p-10">
                <div class="mx-auto w-full space-y-4">
                    <div class="relative inline-block flex flex-row justify-between">
                        <div class="flex flex-row"></div>
                        <button
                            @click="toggleDropdown"
                            class="focus:outline-none text-sm text-gray-400 inline-flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="w-4 h-4 mr-2"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
                                />
                            </svg>
                            <span> model: {{ model }} </span>
                        </button>
                        <div
                            v-show="isDropdownVisible"
                            class="absolute right-0 mt-8 w-48 bg-white rounded-md shadow-md p-2 z-20"
                        >
                            <div
                                v-for="(model, index) in models"
                                :key="index"
                                class="text-sm py-2 px-2 rounded-md hover:bg-gray-200 text-gray-700"
                                @click="selectModel(model)"
                            >
                                {{ model }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap py-4 sm:py-0">
                        <div class="w-full sm:w-1/2 py-2 sm:py-0 sm:pr-2">
                            <textarea
                                v-model="textToImprove"
                                rows="8"
                                class="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-900 focus:border-teal-900"
                                placeholder="To rewrite text, enter or paste it here..."
                            ></textarea>
                        </div>
                        <div class="w-full sm:w-1/2 py-2 sm:py-0 sm:pl-2">
                            <textarea
                                v-model="improvedText"
                                rows="8"
                                class="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-900 focus:border-teal-900"
                                placeholder="Wait for text to be improved..."
                            ></textarea>
                        </div>
                        <div class="w-full py-2 sm:pr-2 flex justify-end">
                            <button
                                type="button"
                                @click="improveSentence"
                                class="inline-flex items-center px-4 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out bg-teal-900 rounded-xl shadow hover:bg-teal-700"
                                :disabled="loading"
                            >
                                <svg
                                    v-if="loading"
                                    class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {{ loading ? 'Fixing...' : 'Fix Grammar' }}
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="errors.length"
                        class="bg-orange-100 border-4 border-orange-500 text-orange-900 px-4 py-3 mb-2 rounded-md shadow-sm"
                        role="alert"
                    >
                        <h4 class="text-md font-bold">Fix list</h4>
                        <ul class="list-disc px-4">
                            <li v-for="(error, index) in errors" :key="index">
                                <span class="text-sm font-bold mb-2 mr-2">{{ error.type }}:</span>
                                <span class="text-sm">{{ error.explain }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="text-sm text-center text-slate-500 mt-8">
                        <div class="mt-2">by Oxymnds</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Configuration, OpenAIApi } from 'openai'

export default {
    data: () => ({
        loading: false,
        textToImprove: null,
        improvedText: null,
        errors: [],
        isDropdownVisible: false,
        model: 'gpt-3.5-turbo',
        models: ['gpt-3.5-turbo', 'gpt-4'],
    }),
    computed: {
        apiKey() {
            return localStorage.getItem('openai_api_key')
        },
    },
    methods: {
        toggleDropdown() {
            this.isDropdownVisible = !this.isDropdownVisible
        },
        async createPrompt(input) {
            const templateResponse = await fetch('/prompts/correct-grammar.prompt')
            const template = await templateResponse.text()

            return template.replace('{{user_input}}', input)
        },
        async improveSentence() {
            this.improvedText = null

            if (!this.textToImprove.trim()) {
                return
            }

            const prompt = await this.createPrompt(this.textToImprove)

            this.loading = true

            try {
                const config = new Configuration({
                    apiKey: this.apiKey,
                })

                const openai = new OpenAIApi(config)
                const completion = await openai.createChatCompletion({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    max_tokens: 2500,
                    temperature: 0.7,
                })

                const response = JSON.parse(completion.data.choices[0].message.content)
                this.improvedText = response.improved
                this.errors = response.errors
            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
            }
        },
    },
}
</script>
