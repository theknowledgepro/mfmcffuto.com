/** @format */

import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';

export const isOverflown = (element) => {
	return element?.scrollHeight > element?.clientHeight || element?.scrollWidth > element?.clientWidth;
};

export const GridCellExpand = React.memo(function GridCellExpand(props) {
	const { width, value } = props;
	const wrapper = React.useRef(null);
	const cellDiv = React.useRef(null);
	const cellValue = React.useRef(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [showFullCell, setShowFullCell] = React.useState(false);
	const [showPopper, setShowPopper] = React.useState(false);

	const handleMouseEnter = () => {
		const isCurrentlyOverflown = isOverflown(cellValue?.current);
		setShowPopper(isCurrentlyOverflown);
		setAnchorEl(cellDiv.current);
		setShowFullCell(true);
	};

	const handleMouseLeave = () => {
		setShowFullCell(false);
	};

	React.useEffect(() => {
		if (!showFullCell) return undefined;

		function handleKeyDown(nativeEvent) {
			// IE11, Edge (prior to using Bink?) use 'Esc'
			if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') setShowFullCell(false);
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [setShowFullCell, showFullCell]);

	return (
		<Box
			ref={wrapper}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			sx={{
				alignItems: 'center',
				lineHeight: '24px',
				width: '100%',
				height: '100%',
				position: 'relative',
				display: 'flex',
			}}>
			<Box
				ref={cellDiv}
				sx={{
					height: '100%',
					width,
					display: 'block',
					position: 'absolute',
					top: 0,
				}}
			/>
			<Box ref={cellValue} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
				{value}
			</Box>
			{showPopper && (
				<Popper open={showFullCell && anchorEl !== null} anchorEl={anchorEl} style={{ width, marginLeft: -17 }}>
					<Paper elevation={1} style={{ minHeight: wrapper?.current?.offsetHeight - 3 }}>
						<div variant='body2' style={{ padding: 8 }}>
							{value}
						</div>
					</Paper>
				</Popper>
			)}
		</Box>
	);
});

export const renderCellExpand = (params) => {
	return <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />;
};

const MuiXDataGridTable = ({ rows, columns, slots, initialState, pageSizeOptions, checkboxSelection, otherProps = {} }) => {
	return (
		<DataGrid
			className='mild-shadow bg-white'
			{...otherProps}
			rows={rows}
			columns={columns}
			slots={{
				toolbar: GridToolbar,
				...slots,
			}}
			initialState={{
				pagination: {
					paginationModel: { page: 0, pageSize: 5 },
				},
				...initialState,
			}}
			pageSizeOptions={pageSizeOptions ? pageSizeOptions : [5, 10, 20]}
			checkboxSelection={checkboxSelection}
		/>
	);
};

export default MuiXDataGridTable;
