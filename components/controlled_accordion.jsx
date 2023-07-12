/** @format */

import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';

const ControlledAccordion = ({ parentClassName, accordionSummary, accordionBody }) => {
	const [expanded, setExpanded] = React.useState(false);
	const handleToggle = () => (event, isExpanded) => setExpanded(isExpanded ? true : false);

	const handleMouseOver = () => setExpanded(true);
	const handleMouseOut = () => setExpanded(false);
	return (
		<Accordion
			className={parentClassName}
			expanded={expanded}
			onChange={handleToggle}
			onMouseOut={handleMouseOut}
			onMouseOver={handleMouseOver}
			sx={{ mb: 1 }}>
			<AccordionSummary aria-controls={`-content`} id={`-header`}>
				<div className='w-full flex flex-col items-center justify-center'>{accordionSummary} </div>
			</AccordionSummary>
			<AccordionDetails>
				<Divider />
				{accordionBody}
			</AccordionDetails>
		</Accordion>
	);
};

export default ControlledAccordion;
