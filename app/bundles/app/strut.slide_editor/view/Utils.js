define({
	computeSlideDimensions: function($opTable) {
		var width = $opTable.width();
		var height = $opTable.height();

		if (height < 300)
			height = 300;

		var slideSize = config.slide.size;

		var xScale = (width - 30) / slideSize.width;
		var yScale = (height - 30) / slideSize.height;

		var scale = Math.min(xScale, yScale);

		var scaledWidth = scale * slideSize.width;
		var scaledHeight = scale * slideSize.height;

		var remainingWidth = width - scaledWidth;
		var remainingHeight = height - scaledHeight;

		return {
			scale: scale,
			scaledWidth: scaledWidth,
			scaledHeight: scaledHeight,
			remainingWidth: remainingWidth,
			remainingHeight: remainingHeight
		}
	}
});