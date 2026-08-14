# Как выложить игру на GitHub Pages

На GitHub должна сохраниться такая структура:

```text
index.html
styles.css
game.js
check-assets.html
assets/
  title-splash.png
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
  meadow-clover.png
  meadow-daisy.png
  meadow-honeycomb.png
  meadow-leaf.png
  meadow-strawberry.png
  forest-acorn.png
  forest-amanita.png
  forest-birch-leaf.png
  forest-boletus.png
  forest-pinecone.png
  village-apple.png
  village-fence-plank.png
  village-lily-pad.png
  village-sunflower.png
  village-water-drop.png
  city-asphalt.png
  city-brick.png
  city-concrete.png
  city-traffic-light.png
  city-window.png
  sea-anchor.png
  sea-lifebuoy.png
  sea-pearl.png
  sea-shell.png
  sea-wave.png
  mountain-compass.png
  mountain-crystal.png
  mountain-edelweiss.png
  mountain-peak.png
  mountain-rock.png
```

Важно:

- Папка должна называться ровно `assets`.
- Имена PNG должны совпадать полностью, включая маленькие буквы и дефисы.
- `assets` должна лежать рядом с `index.html`, не внутри другой папки.
- Если игра лежит в подпапке, например `poputchik-tetris/index.html`, то `assets` должна лежать внутри этой же подпапки: `poputchik-tetris/assets/...`.
- После загрузки откройте `check-assets.html` на GitHub Pages. Если все строки показывают `OK`, картинки доступны игре.

Если на экране игры виден плоский фон с простыми елками и солнцем, значит PNG-картинки уровней не загрузились.
