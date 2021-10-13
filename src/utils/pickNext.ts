export default (array: any[], curItem: any, type: -1 | 1 = 1) => {
	const length = array.length;
	if (length == 0) return null;
	if (!curItem) return null;
	const curIndex = array.findIndex(item => item == curItem);
	if (curIndex == -1) return null;
	let increment = 1;
	if (type == -1) increment = length - 1;
	const nextIndex = (curIndex + increment) % length;
	return array[nextIndex];
};
