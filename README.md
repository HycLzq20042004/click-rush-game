# Click Rush

一个可以直接在浏览器运行的点击得分小游戏。

## 怎么自己运行

双击 `index.html`，或者在浏览器里打开这个文件即可。

## 游戏玩法

- 点击发光圆点得分。
- 圆点越小，分数越高。
- 点空会扣 2 分。
- 30 秒结束后会保存最高分。

## 后期最常见的优化位置

- 想改游戏时间：打开 `script.js`，搜索 `timeLeft = 30`。
- 想改扣分：打开 `script.js`，搜索 `game.score - 2`。
- 想改颜色：打开 `style.css`，修改 `--accent`、`--teal` 等颜色。
- 想改标题：打开 `index.html`，修改 `Click Rush`。

## 上传 GitHub 的最低必会

1. 会找到项目文件夹。
2. 会确认里面有 `index.html`、`style.css`、`script.js`。
3. 会在 GitHub 新建仓库。
4. 会把这几个文件上传进去。
5. 会打开 GitHub Pages。
