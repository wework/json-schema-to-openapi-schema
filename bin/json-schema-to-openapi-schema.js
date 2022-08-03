#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const converter = require('../dist/cjs/index.js').default;
const helpText = require('./help-text.json');
const fs = require('fs');
const readFileAsync = require('util').promisify(fs.readFile);

(async function main() {
	let args = parseArgs();
	let command = args.command;
	let file = args.file;
	let options = args.options;

	if (options.help) {
		// Show help text and exit
		console.log(getHelpText(command));
		process.exit(0);
	} else if (command === 'convert' && file) {
		// Convert the JSON Schema file
		await convert(file, options);
	} else {
		// Invalid args.  Show help text and exit with non-zero
		console.error('Error: Invalid arguments\n');
		console.error(getHelpText(command));
		process.exit(1);
	}
})();

/**
 * Parses the command-line arguments
 *
 * @returns {object} - The parsed arguments
 */
function parseArgs() {
	// Configure the argument parser
	yargs
		.option('d', {
			alias: 'dereference',
			type: 'boolean',
			default: false,
		})
		.option('h', {
			alias: 'help',
			type: 'boolean',
		});

	// Show the version number on "--version" or "-v"
	yargs.version().alias('v', 'version');

	// Disable the default "--help" behavior
	yargs.help(false);

	// Parse the command-line arguments
	let args = yargs.argv;

	// Normalize the parsed arguments
	let parsed = {
		command: args._[0],
		file: args._[1],
		options: {
			dereference: args.dereference,
			help: args.help,
		},
	};

	return parsed;
}

/**
 * Convert an JSON Schema to OpenAPI schema
 *
 * @param {string} file - The path of the file to convert
 * @param {object} options - Conversion options
 */
async function convert(file, options) {
	try {
		const schema = await readFileAsync(file, 'utf8');
		const converted = await converter(JSON.parse(schema), options);
		console.log(JSON.stringify(converted));
	} catch (error) {
		errorHandler(error);
	}
}

/**
 * Returns the help text for the specified command
 *
 * @param {string} [commandName] - The command to show help text for
 * @returns {string} - the help text
 */
function getHelpText(commandName) {
	let lines = helpText[commandName] || helpText.default;
	return lines.join('\n');
}

/**
 * Writes error information to stderr and exits with a non-zero code
 *
 * @param {Error} err
 */
function errorHandler(err) {
	let errorMessage = process.env.DEBUG ? err.stack : err.message;
	console.error(errorMessage);
	process.exit(1);
}
