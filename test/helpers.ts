import fs from 'fs';
import { join } from 'path';

export const getSchema = (file: string) => {
	const path = join(__dirname, 'schemas', file);
	return JSON.parse(fs.readFileSync(path).toString());
};
