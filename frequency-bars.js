/**
 * the frequency histogram
 *
 * @param {string} selector
 * @constructor
 */
const FrequencyBars = function (selector) {
  this.$canvas = document.querySelector(selector);
  this.adjustCanvasSize();
  this.canvasContext = this.$canvas.getContext("2d");
  this.data = null; // Store the last data to redraw on resize

  // Listen for resize events
  window.addEventListener('resize', () => {
      this.adjustCanvasSize();
      if (this.data) { // Redraw only if data exists
          this.update(this.data);
      }
  });
};

FrequencyBars.prototype.adjustCanvasSize = function () {
  this.$canvas.width = document.body.clientWidth;
  this.$canvas.height = document.body.clientHeight / 2;
};


/**
 * @param {Uint8Array} data
 */
FrequencyBars.prototype.update = function (data) {
  this.data = data; // Store the current data for redrawing on resize
  const length = 64; // low frequency only
  const width = this.$canvas.width / length - 0.5;
  this.canvasContext.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
  for (var i = 0; i < length; i += 1) {
      this.canvasContext.fillStyle = "#CB6843";
      this.canvasContext.fillRect(
          i * (width + 0.5),
          this.$canvas.height - data[i],
          width,
          data[i]
      );
  }
};