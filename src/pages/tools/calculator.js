import utils from './utils'

const errorMessage = "I don't understand your expression. Please use Javascript syntax, or the other tools"

const mathCalculatorAction = (input) => {
	const expression = utils.matchPattern(/expression\s?=\s?(?:"|')(.+)(?:"|')/, input)

	if (!expression) {
		return errorMessage
	}

	try {
		const result = eval(expression)
		return `${result}`
	} catch (error) {
		return errorMessage
	}
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
