# Как выложить игру на GitHub Pages

На GitHub должна сохраниться такая структура:

```text
index.html
styles.css
game.js
check-assets.html
assets/
  level-01-summer-meadow.png
  level-02-birch-forest.png
  level-03-riverside-village.png
  level-04-big-city.png
  level-05-seaside.png
  level-06-mountains.png
  level-07-snowy-forest.png
  level-08-night-city.png
  level-09-aurora.png
  level-10-space.png
```

Важно:

- Папка должна называться ровно `assets`.
- Имена PNG должны совпадать полностью, включая маленькие буквы и дефисы.
- `assets` должна лежать рядом с `index.html`, не внутри другой папки.
- Если игра лежит в подпапке, например `poputchik-tetris/index.html`, то `assets` должна лежать внутри этой же подпапки: `poputchik-tetris/assets/...`.
- После загрузки откройте `check-assets.html` на GitHub Pages. Если все строки показывают `OK`, картинки доступны игре.

Если на экране игры виден плоский фон с простыми елками и солнцем, значит PNG-картинки уровней не загрузились.
