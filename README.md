# Le Petit Prince — Application mobile

Application mobile développée dans le cadre du module **R4.A.11** (BUT Informatique, S4).

## Description

Application React Native / Expo autour de l'univers du *Petit Prince*. Elle propose une interface à onglets avec authentification, accessible sur iOS, Android et Web.

## Fonctionnalités

- **Connexion** : authentification via une API REST, avec option "Se souvenir de moi" (persistance via AsyncStorage)
- **Accueil** : page principale après connexion
- **Articles** : liste d'articles
- **Galerie** : galerie d'images
- **Dates** : événements ou dates clés
- **Contact** : informations de contact

## Stack technique

- [Expo](https://expo.dev) / [Expo Router](https://expo.github.io/router) (navigation par fichiers)
- React Native (TypeScript)
- Mode clair / sombre automatique

## Installation

```bash
npm install
npx expo start
```

Scanner le QR code avec [Expo Go](https://expo.dev/go) pour tester sur mobile.

## Structure

```
app/
  index.tsx          # Écran de connexion
  DataContext.tsx    # Contexte global (auth, API)
  (tabs)/
    index.tsx        # Accueil
    articles.tsx     # Articles
    galerie.tsx      # Galerie
    dates.tsx        # Dates
    contact.tsx      # Contact
```
