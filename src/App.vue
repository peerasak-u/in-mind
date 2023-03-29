<template>
  <div
    class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 font-robotoMono"
  >
    <div class="relative py-3 w-3/4 sm:mx-auto">
      <div
        class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10"
      >
        <div class="mx-auto w-full space-y-8">
          <div class="flex space-x-4">
            <input
              v-if="apiKey"
              v-model="question"
              type="text"
              class="w-full text-slate-600 leading-relaxed block bg-gray-100 rounded-xl p-2 border-2 border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="What do you want to know?"
            />
            <input
              v-else
              v-model="openAiKey"
              type="text"
              class="w-full text-slate-600 leading-relaxed block bg-gray-100 rounded-xl p-2 border-2 border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Insert your OpenAI API key ..."
            />
            <button
              v-if="apiKey"
              type="button"
              @click="reasonAct"
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
              {{ loading ? "Thinking..." : "Send" }}
            </button>
            <button
              v-else
              type="button"
              @click="saveApiKey"
              class="inline-flex items-center px-4 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out bg-teal-900 rounded-xl shadow hover:bg-teal-700"
              :disabled="loading"
            >
              Save
            </button>
          </div>
          <div class="relative inline-block flex flex-row justify-between">
            <div class="flex flex-row">
              <button
                v-for="(tool, index) in tools"
                :key="index"
                :class="`inline-block rounded-md border-2 ${
                  tool.selected === true
                    ? 'bg-teal-800 text-white border-teal-900'
                    : 'border-gray-200'
                } transition duration-150 ease-in-out px-4 py-2 mx-1 text-xs font-medium ${
                  tool.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`"
                @click="selectTool(tool)"
              >
                {{ tool.emoji }} {{ tool.name }}
              </button>
            </div>
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

          <div>
            <div
              v-for="(message, index) in messages"
              :key="`Card${index}`"
              :class="`message-${index}`"
            >
              <div
                v-if="message.type === 'Thought'"
                class="bg-slate-100 border-slate-500 text-slate-900 px-4 py-3 mb-2 rounded-md"
                role="alert"
              >
                <div class="flex">
                  <div>
                    <p class="font-bold mb-2">{{ message.type }}</p>
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
                </div>
              </div>
              <div
                v-else-if="message.type === 'Action'"
                class="bg-slate-200 border-slate-600 text-slate-900 px-4 py-3 mb-2 rounded-md"
                role="alert"
              >
                <div class="flex">
                  <div>
                    <p class="font-bold mb-2">{{ message.type }}</p>
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
                </div>
              </div>
              <div
                v-else-if="message.type === 'Question'"
                class="bg-slate-50 border-t-4 border-slate-500 text-slate-900 px-4 py-3 mb-2 rounded-md shadow-sm"
                role="alert"
              >
                <div class="flex">
                  <div>
                    <p class="font-bold mb-2">{{ message.type }}</p>
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
                </div>
              </div>
              <div
                v-else-if="message.type === 'Final Answer'"
                class="bg-orange-100 border-4 border-orange-500 text-orange-900 px-4 py-3 mb-2 rounded-md shadow-sm"
                role="alert"
              >
                <div class="flex">
                  <div>
                    <p class="text-lg font-bold mb-2">{{ message.type }}</p>
                    <p class="text-md">{{ message.content }}</p>
                  </div>
                </div>
              </div>
              <div
                v-else-if="message.type === 'Error'"
                class="bg-red-100 border-4 border-red-500 text-red-900 px-4 py-3 mb-2 rounded-md shadow-sm"
                role="alert"
              >
                <div class="flex">
                  <div>
                    <p class="font-bold mb-2">{{ message.type }}</p>
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="rounded-md bg-teal-900 p-4 mb-2">
                <h3 class="text-lg font-bold text-slate-200 sm:text-xl">
                  {{ message.type }}
                </h3>

                <p class="mt-2 text-sm text-slate-100 whitespace-pre-wrap">
                  {{ message.content }}
                </p>
              </div>
            </div>

            <div
              v-if="loading"
              class="animate-bounce mx-auto mt-7 text-sm text-center"
            >
              🤔 Thinking...
            </div>
          </div>

          <div class="text-sm text-center text-slate-500 mt-8">by Oxymnds</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Configuration, OpenAIApi } from "openai";

const googleSearch = async (input) => {
  const results = await fetch(
    `http://localhost:3000/v1/search?q=${encodeURIComponent(input)}`
  );
  const json = await results.json();

  return json;
};

const googleToolAction = async (input) => {
  const results = await googleSearch(input);

  const output = results.map((item) => {
    return `- ${item.title}: ${item.description}`;
  });

  return output.slice(0, 5).join("\n");
};

const dateCalculatorAction = (input) => {
  const [from, to, type] = input
    .split(",")
    .map((date) => date.replace(/("|')/g, "").trim());

  let divider = 1000 * 60 * 60 * 24;

  switch (type) {
    case "year":
      divider = 1000 * 60 * 60 * 24 * 365;
      break;
    case "month":
      divider = 1000 * 60 * 60 * 24 * 30;
      break;
    case "day":
      divider = 1000 * 60 * 60 * 24;
      break;
    default:
      divider = 1000 * 60 * 60 * 24;
      break;
  }

  const result = Math.floor(new Date(to) - new Date(from)) / divider;

  return `${result}`;
};

const mathCalculatorAction = (expression) => {
  const result = eval(expression);
  return `${result}`;
};

export default {
  data() {
    return {
      loading: false,
      question: "If Leonado da Vinci were still alive, how old would he be?",
      openAiKey: "",
      messages: [],
      isDropdownVisible: false,
      model: "gpt-3.5-turbo",
      models: ["gpt-3.5-turbo", "gpt-4"],
      tools: [
        {
          name: "google_search",
          emoji: "🔍",
          description:
            "the best search engine in the world. if you don't know the anwser, google it first, input should be a query keyword",
          selected: true,
          disabled: false,
          task: googleToolAction,
        },
        {
          name: "math_calculator",
          emoji: "🧮",
          description:
            "calculator for mathamatic problem by using javascript, input should be a mathamatic problem in javascript expression format",
          selected: false,
          disabled: false,
          task: mathCalculatorAction,
        },
        {
          name: "date_calculator",
          emoji: "📅",
          description:
            "calculator day between two dates, input should be 'from' and 'to' dates in format 'YYYY-MM-DDTHH:mm:ss.sssZ' and expected result unit in format select one from ['year', 'month', 'day'] separated by comma respectively and no title",
          selected: false,
          disabled: false,
          task: dateCalculatorAction,
        },
      ],
    };
  },
  computed: {
    selectedTools() {
      return this.tools.filter((tool) => tool.selected);
    },
    apiKey() {
      return localStorage.getItem("openai_api_key");
    },
  },
  methods: {
    saveApiKey() {
      localStorage.setItem("openai_api_key", this.openAiKey);
      console.log("saved");
      console.log(this.apiKey);
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    selectModel(model) {
      this.model = model;
      this.isDropdownVisible = false;
    },
    selectTool(tool) {
      tool.selected = !tool.selected;
    },
    createPrompt(question, tools) {
      const prefix_prompt =
        "Answer the following questions as best you can. If you not sure in answer, you can access to the following tools to finding the answer:";
      const suffix_template =
        "Use the following format strictly:\nQuestion: the input question you must answer\nThought: you should always think about what to do step by step or question by question\nAction: the action to take, should be one of [{{tool_names}}]\nAction Input: the input to the action\nObservation: the result of the action\n... (this Thought/Action/Action Input/Observation can repeat N times)\nThought: I now know the final answer\nFinal Answer: the final answer to the original input question\n\n\nBegin!\nCurrent Date: {{current_date}}\nQuestion: {{user_input}}\nThought: ";
      const suffix_prompt = suffix_template
        .replace("{{tool_names}}", tools.map((tool) => tool.name).join(", "))
        .replace("{{user_input}}", question)
        .replace("{{current_date}}", new Date().toISOString().split("T")[0]);

      const promptTemplate = `${prefix_prompt}\n\n${tools
        .map((tool) => `${tool.name}: ${tool.description}`)
        .join("\n")}\n\n${suffix_prompt}`;

      const prompt = promptTemplate
        .replace("{input}", question)
        .replace("{tool_names}", tools.map((tool) => tool.name).join(", "));

      return prompt;
    },
    async think(input, tools) {
      const config = new Configuration({
        apiKey: this.apiKey,
      });

      const openai = new OpenAIApi(config);
      const completion = await openai.createChatCompletion({
        model: this.model,
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
        max_tokens: 2500,
        temperature: 0,
      });

      const message =
        "Thought: " +
        completion.data.choices[0].message.content.replace(
          /(Action Input|Action|Thought|Observation|Final Answer)\s?([0-9]+)/g,
          "$1"
        );

      const lines = message.split("\n").map((line) => {
        const typePattern =
          /^(Action Input|Action|Thought|Observation|Final Answer):\s/;
        const type = line.match(typePattern);
        const content = line.replace(typePattern, "");

        return {
          type: type ? type[1] : null,
          content,
        };
      });

      const actionInputIndex = lines.findIndex((line) =>
        line.type ? line.type === "Action Input" : false
      );

      if (actionInputIndex === -1) {
        this.messages.push(...lines);
        this.scrollToLatest();
        return message;
      }

      const thoughtLines = lines.slice(0, actionInputIndex + 1);

      console.log(
        thoughtLines.map((line) => `${line.type}: ${line.content}`).join("\n")
      );

      this.messages.push(thoughtLines[0]);
      this.scrollToLatest();

      const actionTool = thoughtLines.find((line) => line.type === "Action");
      const actionInput = thoughtLines.find(
        (line) => line.type === "Action Input"
      );

      if (!actionTool || !actionInput) {
        throw new Error("Action or Action Input not found");
      }

      this.messages.push({
        type: "Action",
        content: `${actionTool.content}(${actionInput.content})`,
      });
      this.scrollToLatest();

      const tool = tools.find((tool) => tool.name === actionTool.content);

      if (!tool) {
        throw new Error("Tool not found");
      }

      const result = await tool.task(actionInput.content);

      const observation = {
        type: "Observation",
        content: result,
      };

      console.log(`Observation: ${observation.content}`);
      this.messages.push(observation);
      this.scrollToLatest();

      const newLines = [...thoughtLines, observation];
      const newPromptSuffix = newLines
        .map((line) => {
          return `${line.type}: ${line.content}`;
        })
        .join("\n");

      const newPrompt = input + newPromptSuffix + "\nThought: ";

      const response = await this.think(newPrompt, tools);

      return response;
    },
    async scrollToLatest() {
      const last = this.messages.length - 1;

      await new Promise((resolve) => setTimeout(resolve, 400));
      const el = this.$el.getElementsByClassName(`message-${last}`)[0];

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    async reasonAct() {
      this.messages = [];

      if (!this.question.trim()) {
        return;
      }

      this.messages.push({ type: "Question", content: this.question });

      console.log("Question: " + this.question);

      const prompt = this.createPrompt(this.question, this.selectedTools);

      this.loading = true;

      try {
        const response = await this.think(prompt, this.selectedTools);
        console.log(response);
      } catch (error) {
        console.error(error);
        this.messages.push({
          type: "Error",
          content: error.message || "Something went wrong",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
</style>
