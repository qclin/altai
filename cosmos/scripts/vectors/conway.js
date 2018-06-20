export default  class Conway{
  constructor(width, height){
    this.grid;
    this.resolution = 10;
    this.width = width;
    this.height = height;
    this.cols = this.width / this.resolution;;
    this.rows = this.height / this.resolution;;
  }

  setup(){
    this.grid = this.make2DArray(this.cols, this.rows);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = Math.floor(Math.random(2));
      }
    }
  }

  display(){
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x = i * this.resolution;
        let y = j * this.resolution;
        if (this.grid[i][j] == 1) {
          fill(255);
          stroke(0);
          rect(x, y, this.resolution - 1, this.resolution - 1);
        }
      }
    }

    let next = this.make2DArray(this.cols, this.rows);

    // Compute next based on grid
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let state = this.grid[i][j];
        // Count live neighbors!
        let sum = 0;
        let neighbors = this.countNeighbors(this.grid, i, j);

        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }

      }
    }

    this.grid = next;
  }


  make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + this.cols) % this.cols;
        let row = (y + j + this.rows) % this.rows;
        sum += grid[col][row];
        console.log("what is grid::: ", grid[col][row], this.cols, this.rows, sum);

      }
    }
    sum -= grid[x][y];
    return sum;
  }
}
