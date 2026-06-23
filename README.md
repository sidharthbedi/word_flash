# Word Flash

An Android flashcard app for learning new words — built for my daughter.

She kept skipping words she did not know while reading. This app lets me add words as she encounters them, and lets her flip through cards to learn meanings at her own pace.

No internet required. No account needed. Just words.

---

## Features

- Add words and definitions via an admin screen
- Cards that flip to reveal meaning when tapped
- Swipe to move between words
- Works fully offline
- Clean dark UI

## Tech Stack

- React Native
- AsyncStorage for local data persistence
- React Navigation
- EAS Build for APK generation

## Getting Started

```bash
npm install
npx expo start
```

To build an APK:

```bash
eas build -p android --profile preview
```

## Security

This app has no network access, no backend, and no external data sharing. All data is stored locally on the device using Android's sandboxed storage.

---

Built with Claude Code.
