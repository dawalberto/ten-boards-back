const deleteUndefinedPropsOfObject = (object) => {
	for (const [key, value] of Object.entries(object)) {
		if (value === undefined) {
			delete object[key]
		}
	}
}

module.exports = { deleteUndefinedPropsOfObject }
