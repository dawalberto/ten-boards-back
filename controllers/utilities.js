const deleteUndefinedPropsOfObject = (object) => {
	for (const [key, value] of Object.entries(object)) {
		if (!value) {
			delete object[key]
		}
	}
}

module.exports = { deleteUndefinedPropsOfObject }
