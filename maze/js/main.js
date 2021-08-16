'use strict';
(() => {

  /*** 迷路の描画 ***/
  class MazeRenderer {
    constructor(canvas) {
      this.ctx = canvas.getContext('2d');
      this.WALL_SIZE = 10;
    }

    render(data) {
      canvas.height = data.length * this.WALL_SIZE;
      canvas.width  = data[0].length * this.WALL_SIZE;

      for (let row = 0; row < data.length; row++) {
        for (let col = 0; col < data[0].length; col++) {
          if (data[row][col] === 1) {
            this.ctx.fillRect(
              col * this.WALL_SIZE,
              row * this.WALL_SIZE,
              this.WALL_SIZE,
              this.WALL_SIZE
            );
          }
        }
      }
    }
  }

  /*** 迷路の設定 ***/
  class Maze {
    constructor(row, col, renderer) {
      if (row < 5 || col < 5 || row % 2 === 0 || col % 2 === 0) {
        alert('Size not valid!');
        return;
      }
      this.renderer = renderer;
      this.row  = row;
      this.col  = col;
      this.data = this.getData();
    }

    getData() {
      const data = [];

      // 二次元配列でブロックを作る
      for (let row = 0; row < this.row; row++) {
        data[row] = [];
        for (let col = 0; col < this.col; col++) {
          data[row][col] = 1;
        }
      }

      // 外周を壁にして外枠を作る
      for (let row = 1; row < this.row - 1; row++) {
        for (let col = 1; col < this.col - 1; col++) {
          data[row][col] = 0;
        }
      }

      // 格子状にブロックを配置する
      for (let row = 2; row < this.row - 2; row += 2) {
        for (let col = 2; col < this.col - 2; col += 2) {
          data[row][col] = 1;
        }
      }

      for (let row = 2; row < this.row - 2; row += 2) {
        for (let col = 2; col < this.col - 2; col += 2) {
          let destRow;
          let destCol;

          do {
            const dir = row === 2 ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 3);
            switch (dir) {
              case 0:   //上
                destRow = row - 1;
                destCol = col;
                break;
              case 1:   //下
                destRow = row + 1;
                destCol = col;
                break;
              case 2:   //左
                destRow = row;
                destCol = col - 1;
                break;
              case 3:   //右
                destRow = row;
                destCol = col + 1;
                break;
            }
          } while (data[destRow][destCol] === 1);

          data[destRow][destCol] = 1;
        }
      }
      return data;
    }

    /*** 迷路の描画 ***/
    render() {
      this.renderer.render(this.data);
    }
  }

  const canvas  = document.querySelector('canvas');
  if (typeof canvas.getContext === 'undefined') {
    return;
  }

  const maze = new Maze(21, 13, new MazeRenderer(canvas));
  maze.render();

})();
