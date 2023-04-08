const matchPattern = (patternStr, input, selectGroup = 1) => {
	const pattern = RegExp(patternStr)
	return input.match(pattern)[selectGroup]
}

export default {
	matchPattern,
}
