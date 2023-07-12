/** @format */

const initialDate = 2001;
const yearPeriods = 100;
module.exports = [...Array(yearPeriods)].map((period, index) => {
	return `${initialDate + index} / ${initialDate + index + 1}`;
});
