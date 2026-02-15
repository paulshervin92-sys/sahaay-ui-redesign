

import React from "react";
import PageFlipContainer from "@/components/diary/PageFlipContainer";

const Journal = () => {
	return (
		<div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-background to-secondary/40">
			<PageFlipContainer />
		</div>
	);
};

export default Journal;
