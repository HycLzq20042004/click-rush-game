# Click Rush

一个可以直接在浏览器运行的点击 Boss 小游戏。

## 怎么自己运行

双击 `index.html`，或者在浏览器里打开这个文件即可。

## 游戏玩法

- 开始前可以输入玩家名字。
- 可以选择 Easy、Normal、Hard 三种难度，每个难度有独立排行榜。
- 可以开启或关闭音效。
- 点击发光圆点得分并攻击下方 Boss。
- 圆点越小，分数和伤害越高。
- 点空会扣分并断掉连击。
- Boss 被击中时会有受击反馈和伤害数字。
- 不同难度有不同 Boss 数量，Easy 有 5 个，Normal 有 6 个，Hard 有 6 个。
- 如果提前打完所有 Boss，游戏会立刻结算，并记录通关时间。
- 通关记录按完成时间排名，未通关记录只按最终分数显示。

## 后期最常见的优化位置

- 想改游戏时间：打开 `script.js`，搜索 `duration`。
- 想改 Boss 血量：打开 `script.js`，搜索 `bossRosters`。
- 想改难度：打开 `script.js`，搜索 `difficulties`。
- 想改颜色：打开 `style.css`，修改 `--accent`、`--teal` 等颜色。
- 想改标题：打开 `index.html`，修改 `Click Rush`。
