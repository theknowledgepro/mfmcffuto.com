/** @format */

import React from 'react';
import comp_styles from './components.module.css';

const FlipCard = React.forwardRef(({ onClick, cardWrapperClassName, cardWrapperHeight, header, frontContent, rearContent }, ref) => (
	<div style={{ height: cardWrapperHeight }} className={`${cardWrapperClassName} ${comp_styles.flip_card}`}>
		<div ref={ref} onClick={onClick} className={comp_styles.flip_card_content}>
			<div className={comp_styles.flip_card_front}>
				{header && <div className={comp_styles.flip_card_header}>{header}</div>}
				{frontContent}
			</div>
			<div className={comp_styles.flip_card_back}>{rearContent}</div>
		</div>
	</div>
));

export default FlipCard;
