# Click Rush

A small browser game that runs directly from `index.html` or GitHub Pages.

## Run It

Open `index.html` in a browser, or visit:

https://hyclzq20042004.github.io/click-rush-game/

## Gameplay

- Enter a player name before starting.
- Pick Easy, Normal, or Hard. Each difficulty has its own leaderboard.
- Click the glowing target to score points and damage the current boss.
- Missing the target loses points and breaks the combo.
- Bosses show hit feedback, damage numbers, and health.
- Clearing every boss ends the run early and records the clear time.
- Completed runs rank by clear time. Unfinished runs show final score.
- Sound can be turned on or off.

## Online PK

- Type the same room code on two devices or browser windows.
- Press `Connect` on both sides.
- Start a run and both players will see the opponent's name, score, boss progress, and result.
- If the room code is left empty, the game creates one for you to share.

## Simple Tuning Points

- Game time: edit `duration` in `script.js`.
- Boss HP: edit `bossRosters` in `script.js`.
- Difficulty behavior: edit `difficulties` in `script.js`.
- Colors: edit CSS variables in `style.css`.
- Page text: edit `index.html`.
