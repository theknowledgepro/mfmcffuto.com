/** @format */

import Image from 'next/image';
import React from 'react';

const ImageTag = (props) => {
	return <Image {...props} height={400} width={400} style={{ ...props?.style, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;
};

export default ImageTag;
