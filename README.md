# Click Rush

一个可以直接在浏览器运行的点击得分小游戏。

## 怎么自己运行

双击 `index.html`，或者在浏览器里打开这个文件即可。

## 游戏玩法

- 点击发光圆点得分。
- 圆点越小，分数越高。
- 点空会扣 2 分。
- 开始前可以输入玩家名字。
- 可以选择 Easy、Normal、Hard 三种难度，每个难度有独立排行榜。
- 可以开启或关闭音效。
- 点中目标会攻击下方 Boss，打倒后进入下一个 Boss。
- 不同难度有不同 Boss 数量，Easy 有 5 个，Normal 有 6 个，Hard 有 6 个。
- Boss 被击中时会有受击反馈和伤害数字。
- 30 秒结束后会保存最高分。
- 页面下方会显示本机浏览器里的前 5 名排行榜。

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
