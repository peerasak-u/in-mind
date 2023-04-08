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
	action: mathCalculatorAction,
}
