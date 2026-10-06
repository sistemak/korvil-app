# KORVIL APK - Build 100% Real

Este projeto gera APK com troca de ícone instantânea via activity-alias.

## AppId
`com.korvil.mestre`

## Ícones necessários
Coloque em `android/app/src/main/res/mipmap-*`:

- ic_korvil.png
- ic_sistemak.png
- ic_kafortunado.png
- ic_kalma.png
- ic_ktp.png

Baixe dos RAWs:

- KORVIL: https://raw.githubusercontent.com/sistemak/korvil-app/main/korvil/assets/images/logokorvil.png
- Sistema K: https://raw.githubusercontent.com/sistemak/korvil-app/main/korvil/sections/sistemak/images/logosistemak.png
- K-Afortunado: https://raw.githubusercontent.com/sistemak/korvil-app/main/korvil/sections/kafortunado/images/logokafortunado.png
- K-Alma: https://raw.githubusercontent.com/sistemak/korvil-app/main/korvil/sections/kalma/images/logokalma.png
- K-TP: https://raw.githubusercontent.com/sistemak/korvil-app/main/korvil/sections/ktp/projetotransformacao/assets/images/logotipos/logoprojetotransformacao.png

Use Android Studio Image Asset ou converta direto.

## Build

```bash
cd korvil-apk
npm install
npx cap sync android
npx cap open android
# No Android Studio: Build > Build APK(s)
```

## Troca de ícone

O plugin `IconChangerPlugin.java` faz:

```java
pm.setComponentEnabledSetting(component, ENABLED/DISABLED, DONT_KILL_APP)
```

JS:

```js
Capacitor.Plugins.IconChanger.changeIcon({icon:'sistemak'})
```

IDs válidos: korvil, sistemak, kafortunado, kalma, ktp

## PWA fallback

Se não tiver APK, use `app-not/index.html` que faz troca via Blob manifest dinâmico + localStorage + timer 60s visibilitychange.

Cache: korvil-v5-dynamic
