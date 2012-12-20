window.paintBucketApp = {
	    context:null,
		drawingAreaX: 0,
		drawingAreaY: 0,
		// Clears the canvas.
		clearCanvas: function () {
			context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		},

		// Draw the elements on the canvas
		redraw: function () {
            this.clearCanvas();

			// Draw the current state of the color layer to the canvas
			context.putImageData(this.colorLayerData, 0, 0);

			// Draw the outline image on top of everything. We could move this to a separate
			//   canvas so we did not have to redraw this everyime.
			//context.drawImage(this.outlineImage, 0, 0, this.canvasWidth, this.canvasHeight);
		},

		matchOutlineColor: function (r, g, b, a) {
			return (r + g + b < 100 && a === 255);
		},

		matchStartColor: function (pixelPos, startR, startG, startB) {

			var r = this.colorLayerData.data[pixelPos],
				g = this.colorLayerData.data[pixelPos + 1],
				b = this.colorLayerData.data[pixelPos + 2],
				a = this.colorLayerData.data[pixelPos + 3];

			// If current pixel of the outline image is black
			if (this.matchOutlineColor(r, g, b, a)) {
				return false;
			}

			// If the current pixel matches the clicked color
			if (r === startR && g === startG && b === startB) {
				return true;
			}

			// If current pixel matches the new color
			if (r === this.curColor[0] && g === this.curColor[1] && b === this.curColor[2]) {
				return false;
			}

			//return true;
			// Return the difference in current color and start color within a tolerance
            return (Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB) < 255);
		},

		colorPixel: function (pixelPos, r, g, b, a) {
			this.colorLayerData.data[pixelPos] = r;
			this.colorLayerData.data[pixelPos + 1] = g;
			this.colorLayerData.data[pixelPos + 2] = b;
			this.colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
		},

		floodFill: function (startX, startY, startR, startG, startB) {
			var newPos,
				x,
				y,
				pixelPos,
				reachLeft,
				reachRight,
				drawingBoundLeft = this.drawingAreaX,
				drawingBoundTop = this.drawingAreaY,
				drawingBoundRight = this.drawingAreaX + this.drawingAreaWidth - 1,
				drawingBoundBottom = this.drawingAreaY + this.drawingAreaHeight - 1,
				pixelStack = [[startX, startY]];

			while (pixelStack.length) {

				newPos = pixelStack.pop();
				x = newPos[0];
				y = newPos[1];

				// Get current pixel position
				pixelPos = (y * this.canvasWidth + x) * 4;

				// Go up as long as the color matches and are inside the canvas
				while (y >= drawingBoundTop && this.matchStartColor(pixelPos, startR, startG, startB)) {
					y -= 1;
					pixelPos -= this.canvasWidth * 4;
				}

				pixelPos += this.canvasWidth * 4;
				y += 1;
				reachLeft = false;
				reachRight = false;

				// Go down as long as the color matches and in inside the canvas
				while (y <= drawingBoundBottom && this.matchStartColor(pixelPos, startR, startG, startB)) {
					y += 1;

					this.colorPixel(pixelPos, this.curColor[0], this.curColor[1], this.curColor[2]);

					if (x > drawingBoundLeft) {
						if (this.matchStartColor(pixelPos - 4, startR, startG, startB)) {
							if (!reachLeft) {
								// Add pixel to stack
								pixelStack.push([x - 1, y]);
								reachLeft = true;
							}
						} else if (reachLeft) {
							reachLeft = false;
						}
					}

					if (x < drawingBoundRight) {
						if (this.matchStartColor(pixelPos + 4, startR, startG, startB)) {
							if (!reachRight) {
								// Add pixel to stack
								pixelStack.push([x + 1, y]);
								reachRight = true;
							}
						} else if (reachRight) {
							reachRight = false;
						}
					}

					pixelPos += this.canvasWidth * 4;
				}
			}
		},

		// Start painting with paint bucket tool starting from pixel specified by startX and startY
		paintAt: function (startX, startY, canvasWidth, canvasHeight, context, colorLayerData, curColor) {
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.context = context;
            this.drawingAreaWidth = canvasWidth;
            this.drawingAreaHeight = canvasHeight;
            //this.outlineImage = outlineImage;
            this.curColor = curColor;
            //console.log(this);
            //console.log(startX + "/" + startY + "=" + canvasWidth + "/" + canvasHeight);
            this.colorLayerData = colorLayerData;//context.getImageData(0, 0, canvasWidth, canvasHeight);

			var pixelPos = (startY * canvasWidth + startX) * 4,
				r = this.colorLayerData.data[pixelPos],
				g = this.colorLayerData.data[pixelPos + 1],
				b = this.colorLayerData.data[pixelPos + 2],
				a = this.colorLayerData.data[pixelPos + 3];

            //console.log(this.curColor[0]);
			if (r === curColor[0] && g === curColor[1] && b === curColor[2]) {
				// Return because trying to fill with the same color
				return;
			}

			if (this.matchOutlineColor(r, g, b, a)) {
				// Return because clicked outline
				return;
			}

			this.floodFill(startX, startY, r, g, b);
			this.redraw();
		}
}