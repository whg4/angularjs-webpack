import { VALUE_SPLIT } from "../config/const"

export const toPathKey = (path) => {
	return path.join(VALUE_SPLIT);
}

export const isLeaf = (item) => item && !item.children;
