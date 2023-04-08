const dateCalculatorAction = (input) => {
	const fromDatePattern = /^from\s?=\s?("|')(.+)("|'), to/
	const from = input.match(fromDatePattern)[2]

	const toDatePattern = /to\s?=\s?("|')(.+)("|'), type/
	const to = input.match(toDatePattern)[2]

	const typePattern = /type\s?=\s?("|')(.+)("|')/
	const type = input.match(typePattern)[2]

	if (!from) {
		return 'Please provide a from date'
	}

	if (!to) {
		return 'Please provide a to date'
	}

	if (!type) {
		return 'Please provide a type'
	}

	let divider = 1000 * 60 * 60 * 24

	switch (type.trim()) {
		case 'year':
			divider = 1000 * 60 * 60 * 24 * 365
			break
		case 'month':
			divider = 1000 * 60 * 60 * 24 * 30
			break
		case 'day':
			divider = 1000 * 60 * 60 * 24
			break
		default:
			divider = 1000 * 60 * 60 * 24
			break
	}

	const result = Math.floor(new Date(to.trim()) - new Date(from.trim())) / divider

	return `${result}`
}

export default {
	name: 'date_calculator',
	emoji: '📅',
	description: 'calculator day between two dates',
	inputs: {
		from: "the start date in format 'YYYY-MM-DDTHH:mm:ss.sssZ'",
		to: "the end date in format 'YYYY-MM-DDTHH:mm:ss.sssZ'",
		type: "a type of answer unit, should be only one from ['year', 'month', 'day']",
	},
	action: dateCalculatorAction,
}
