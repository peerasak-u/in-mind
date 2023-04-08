const googleSearch = async (input) => {
	const results = await fetch(`http://localhost:3000/v1/search?q=${encodeURIComponent(input)}`)
	const json = await results.json()

	return json
}

const googleToolAction = async (input) => {
	const pattern = /query\s?=\s?(.+)/
	const queryWord = input.match(pattern)[1]

	if (!queryWord) {
		return 'Please provide a query'
	}

	const results = await googleSearch(queryWord)

	const output = results.map((item) => {
		return `- ${item.title}: ${item.description}`
	})

	return output.slice(0, 5).join('\n')
}

export default {
	name: 'google',
	emoji: '🌐',
	description:
		"the best search engine in the world. if you don't know the anwser or you need to know a real-time data, google it first!",
	inputs: {
		query: "a single query keyword from only single sub-question, if you have to search birthdate for multiple peoples you should search one by one e.g. 'Donald Trump birthdate'",
	},
	action: (apiKey, model) => {
		return (input) => googleToolAction(input, apiKey, model)
	},
}
