import { Configuration, OpenAIApi } from 'openai'

const cnbcScraper = async (input, apiKey, model) => {
	const results = await fetch('http://localhost:3000/v1/cnbc', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ link: input }),
	})

	const json = await results.json()

	const { article: chunks } = json

	console.log("I've got", chunks.length, 'chunks.')

	// split into a task for each chunk
	const sumTasks = chunks.map((chunk) => cnbcSummarizer(chunk, apiKey, model))

	// wait for all summarize tasks to complete
	const summaries = await Promise.all(sumTasks)

	// merge all summaries into one prompt
	const shortenArticle = summaries.join('\n====================\n')

	// summarize it again
	const summarize = await cnbcSummarizer(shortenArticle, apiKey, model)

	return summarize
}

const cnbcSummarizer = async (chunk, apiKey, model) => {
	const templateResponse = await fetch('/prompts/summarize.prompt')
	const template = await templateResponse.text()

	return new Promise((resolve, reject) => {
		const prompt = template.replace('{{article}}', chunk)

		console.log({ apiKey, prompt })

		const config = new Configuration({
			apiKey: apiKey,
		})

		const openai = new OpenAIApi(config)
		openai
			.createChatCompletion({
				model: model,
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
				max_tokens: 3000,
				temperature: 0.2,
			})
			.then((completion) => {
				resolve(completion.data.choices[0].message.content)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

const cnbcToolAction = async (input, apiKey, model) => {
	const pattern = /url\s?=\s?(.+)/
	const url = input.match(pattern)[1]

	if (!url) {
		return 'Please provide a valid url'
	}

	const result = await cnbcScraper(url, apiKey, model)

	return result
}

export default {
	name: 'cnbc_summarizer',
	emoji: '🌈',
	description: 'summarizing tool for cnbc news by just providing the url',
	inputs: {
		url: 'the url of the news in cnbc.com',
	},
	action: (apiKey, model) => {
		return (input) => cnbcToolAction(input, apiKey, model)
	},
}
