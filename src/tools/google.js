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
	action: googleToolAction,
}
