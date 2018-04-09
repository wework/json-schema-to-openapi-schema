const fs = require('fs');
const join = require('path').join;

const getSchema = file => {
	const path = join(__dirname, 'schemas', file);
	return JSON.parse(fs.readFileSync(path));
};

module.exports = { getSchema };
