export default  class gLife{
  constructor(width, height, palette){
    this.w = 10;
    this.columns = floor(width/this.w);
    this.rows = floor(height/this.w);
    this.board;
    this.next;
    this.palette = palette
  }
  setup() {
    // Wacky way to make a 2D array is JS
    this.board = new Array(this.columns);
    for (var i = 0; i < this.columns; i++) {
      this.board[i] = new Array(this.rows);
    }
    // Going to use multiple 2D arrays and swap them
    this.next = new Array(this.columns);
    for (i = 0; i < this.columns; i++) {
      this.next[i] = new Array(this.rows);
    }
    this.init();
  }

  display() {
    this.generate();
    for ( var i = 0; i < this.columns;i++) {
      for ( var j = 0; j < this.rows;j++) {
        var chooseIndex = Math.floor(Math.random(this.palette.length) * this.palette.length)
        // fill(this.palette[chooseIndex]);
        if ((this.board[i][j] == 1)) fill(255);
        else noFill();
        // stroke(this.palette[chooseIndex]);
        // strokeWeight(1);
        noStroke();
        rect(i*this.w, j*this.w, this.w-1, this.w-1);
      }
    }

  }

  // Fill board randomly
  init() {
    for (var i = 0; i < this.columns; i++) {
      for (var j = 0; j < this.rows; j++) {
        // Lining the edges with 0s
        if (i == 0 || j == 0 || i == this.columns-1 || j == this.rows-1) this.board[i][j] = 0;
        // Filling the rest randomly
        else this.board[i][j] = floor(random(2));
        this.next[i][j] = 0;
      }
    }
  }

  // The process of creating the new generation
  generate() {

    // Loop through every spot in our 2D array and check spots neighbors
    for (var x = 1; x < this.columns - 1; x++) {
      for (var y = 1; y < this.rows - 1; y++) {
        // Add up all the states in a 3x3 surrounding grid
        var neighbors = 0;
        for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
            neighbors += this.board[x+i][y+j];
          }
        }

        // A little trick to subtract the current cell's state since
        // we added it in the above loop
        neighbors -= this.board[x][y];
        // Rules of Life
        if      ((this.board[x][y] == 1) && (neighbors <  2)) this.next[x][y] = 0;           // Loneliness
        else if ((this.board[x][y] == 1) && (neighbors >  3)) this.next[x][y] = 0;           // Overpopulation
        else if ((this.board[x][y] == 0) && (neighbors == 3)) this.next[x][y] = 1;           // Reproduction
        else                                             this.next[x][y] = this.board[x][y]; // Stasis
      }
    }

    // Swap!
    var temp = this.board;
    this.board = this.next;
    this.next = temp;
  }
}
