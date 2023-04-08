const mathCalculatorAction = (input) => {
	const pattern = /expression\s?=\s?("|')(.+)("|')/
	const expression = input.match(pattern)[2]

	if (!expression) {
		return "I don't understand your expression. Please use Javascript syntax"
	}

	const result = eval(expression)
	return `${result}`
}

export default {
	name: 'math_calculator',
	emoji: '🧮',
	description: 'calculator for mathamatic problem by using javascript',
	inputs: {
		expression: "a mathamatic problem in javascript expression format e.g. '1 + 1'",
	},
	action: (apiKey, model) => {
		return (input) => mathCalculatorAction(input, apiKey, model)
	},
}
