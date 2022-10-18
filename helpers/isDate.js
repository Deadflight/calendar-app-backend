const isDate = (value, { req, location, path }) => {
	if (!value || isNaN(new Date(value))) {
		return false;
	}
	return true;
};

module.exports = {
	isDate,
};
