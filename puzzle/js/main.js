'use strict';
(() => {

  /*** PuzzleRendererクラス ***/
  /*** Puzzleの描画設定 ***/
  class PuzzleRenderer {
    constructor(puzzle, canvas) {
      this.puzzle = puzzle;
      this.canvas = canvas;
      this.ctx    = this.canvas.getContext('2d');
      this.TILE_SIZE = 70;
      this.img    = document.createElement('img');
      this.img.src = 'img/bridge.jpg';
      this.img.addEventListener('load', () => {
        this.render();
      });
      this.canvas.addEventListener('click', e => {
        if (this.puzzle.getCompletedStatus()) {
          return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE);
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE);
        this.puzzle.swapTiles(col, row);
        this.render();

        if (this.puzzle.isComplete()) {
          this.puzzle.setCompletedStatus(true);
          this.renderGameClear();
        }
      });
    }

    /*** PuzzleRendererのメソッド群 ***/
    /* クリア時の描画設定 */
    renderGameClear() {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = '28px Arial';
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText('GAME CLEAR!!', 40, 150);
    }

    /* 分割された画像全ての描画設定 */
    render() {
      for (let row = 0; row < this.puzzle.getBoardSize(); row++) {
        for (let col = 0; col < this.puzzle.getBoardSize(); col++) {
          this.renderTile(this.puzzle.getTile(row, col), col, row);
        }
      }
    }

    /* 分割された画像1枚の描画設定 */
    renderTile(n, col, row) {
      if (n === this.puzzle.getBlankIndex()) {
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(
          col * this.TILE_SIZE,
          row * this.TILE_SIZE,
          this.TILE_SIZE,
          this.TILE_SIZE
        );
      } else {
        this.ctx.drawImage(
          this.img,
          (n % this.puzzle.getBoardSize()) * this.TILE_SIZE,
          Math.floor(n / this.puzzle.getBoardSize()) * this.TILE_SIZE,
          this.TILE_SIZE,
          this.TILE_SIZE,
          col * this.TILE_SIZE,
          row * this.TILE_SIZE,
          this.TILE_SIZE,
          this.TILE_SIZE
        );
      }
    }
  }


  /*** Puzzleクラス ***/
  class Puzzle {
    constructor(level) {
      this.level  = level;
      this.tiles  = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ];
      this.UDLR = [
        [0, -1], // 上
        [0,  1], // 下
        [-1, 0], // 左
        [1,  0], // 右
      ];
      this.isCompleted = false;
      this.BOARD_SIZE = this.tiles.length;    // 4
      this.BLANK_INDEX = this.BOARD_SIZE ** 2 - 1;    // 15
      do {
        this.shuffle(this.level);
      } while (this.isComplete() === true);
    }

    /*** Puzzleクラスのメソッド群 ***/
    /* 画像の分割行列数を返す */
    getBoardSize() {
      return this.BOARD_SIZE; //4
    }

    /* 画像の分割枚数を返す */
    getBlankIndex() {
      return this.BLANK_INDEX; //15
    }

    /* Puzzleゲームがクリア状態trueかそうでないかfalseを返す */
    getCompletedStatus() {
      return this.isCompleted;
    }

    /* Puzzleゲームがクリア状態か否かを引数で受け変数に代入する */
    setCompletedStatus(value) {
      this.isCompleted = value;
    }

    /* 引数の位置の画像を返す */
    getTile(row, col) {
      return this.tiles[row][col];
    }

    /* levelの数だけブランクを動かしてシャッフルする */
    shuffle(n) {
      let blankCol = this.BOARD_SIZE - 1;
      let blankRow = this.BOARD_SIZE - 1;

      for (let i = 0; i < n; i++) {
        let destCol;
        let destRow;
        do {
          const dir = Math.floor(Math.random() * this.UDLR.length);
          destCol = blankCol + this.UDLR[dir][0];
          destRow = blankRow + this.UDLR[dir][1];
        } while (this.isOutside(destCol, destRow));

        [
          this.tiles[blankRow][blankCol],
          this.tiles[destRow][destCol],
        ] = [
          this.tiles[destRow][destCol],
          this.tiles[blankRow][blankCol],
        ];

        [blankCol, blankRow] = [destCol, destRow];
      }
    }

    /* 分割された画像とブランクを入れ替える */
    swapTiles(col, row) {
      if (this.tiles[row][col] === this.BLANK_INDEX) {
        return;
      }
      for (let i = 0; i < this.UDLR.length; i++) {
        const destCol = col + this.UDLR[i][0];
        const destRow = row + this.UDLR[i][1];

        if (this.isOutside(destCol, destRow)) {
          continue;
        }

        if (this.tiles[destRow][destCol] === this.BLANK_INDEX) {
          [
            this.tiles[row][col],
            this.tiles[destRow][destCol],
          ] = [
            this.tiles[destRow][destCol],
            this.tiles[row][col],
          ];
          break;
        }
      }
    }

    /* 画像の範囲外かを判定して返す */
    isOutside(destCol, destRow) {
      return (
        destCol < 0 || destCol > this.BOARD_SIZE - 1 ||
        destRow < 0 || destRow > this.BOARD_SIZE - 1
      );
    }

    /* 画像の配置を配置を確認して順序通りであればtrueを返す、そうでなければfalseを返す */
    isComplete() {
      let i = 0;
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let col = 0; col < this.BOARD_SIZE; col++) {
          if (this.tiles[row][col] !== i++) {
            return false;
          }
        }
      }
      return true;
    }

  }

  /*** 実装 ***/
  const canvas = document.querySelector('canvas');
  if (typeof canvas.getContext === 'undefined') {
    return;
  }

  new PuzzleRenderer(new Puzzle(2), canvas);
})();
