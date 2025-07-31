# 🇹🇷 TravelTurkey - Modern Turizm Uygulaması

Türkiye'nin muhteşem turistik yerlerini keşfetmek için geliştirilmiş modern, erişilebilir ve yapay zeka destekli mobil uygulama.

## ✨ Özellikler

- 🗺️ **İnteraktif Harita** - OpenStreetMap tabanlı detaylı haritalar
- ⭐ **Favoriler Sistemi** - Beğendiğiniz yerleri kaydedin
- 🌐 **Çok Dilli Destek** - Türkçe ve İngilizce
- 🌙 **Dark/Light Mode** - Göz dostu temalar
- 📱 **Offline Destek** - İnternet olmadan da kullanabilirsiniz
- 🔐 **Güvenli Giriş** - Biyometrik kimlik doğrulama
- 🎨 **Modern UI/UX** - Tamagui ile özel tasarım sistemi

## 🛠️ Teknoloji Stack

### Frontend

- **React Native 0.80.2** - Cross-platform mobil framework
- **TypeScript** - Type-safe geliştirme
- **Tamagui** - Modern UI library ve custom theme
- **React Navigation 6** - Tab + Stack + Drawer navigation

### State Management

- **Zustand** - Hafif ve performanslı state management
- **React Query** - Server state ve cache yönetimi

### Veritabanı & Backend

- **Supabase** - Backend-as-a-Service
- **SQLite** - Offline veri storage
- **React Native Async Storage** - Local preferences

### Harita & Konum

- **OpenStreetMap** - Açık kaynak harita servisi
- **MapLibre/Mapbox GL** - Harita render engine
- **React Native Geolocation** - Konum servisleri

### Authentication & Security

- **Supabase Auth** - Email/Password, Social login
- **React Native Keychain** - Güvenli key storage
- **React Native Biometrics** - Parmak izi/Face ID

### Analytics & Monitoring

- **Firebase Analytics** - Kullanıcı analizi
- **Firebase Crashlytics** - Crash reporting

## 📁 Proje Yapısı

```
TravelTurkey/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── store/             # Zustand stores
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript definitions
│   ├── assets/            # Images, icons, etc.
│   ├── locales/           # i18n translations
│   └── theme/             # Tamagui theme configuration
├── android/               # Android-specific code
├── ios/                   # iOS-specific code (future)
└── docs/                  # Documentation
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (>=18)
- React Native CLI
- Android Studio + SDK
- JDK 11
- Git

### Projeyi Klonlayın

```bash
git clone https://github.com/travelturkey/mobile-app.git
cd TravelTurkey
```

### Bağımlılıkları Yükleyin

```bash
npm install --legacy-peer-deps
```

### Android için Çalıştırın

```bash
# Metro bundler'ı başlatın (terminal 1)
npx react-native start

# Android uygulamasını başlatın (terminal 2)
npx react-native run-android
```

## 🎨 Custom Theme Sistemi

TravelTurkey, Türk kültürüne uygun özel bir renk paleti kullanır:

### Ana Renkler

- **Primary**: `#D62828` - Türk kırmızısının soft versiyonu
- **Secondary**: `#264653` - Osmanlı lacivertinin pastel tonu
- **Accent Gold**: `#E9C46A` - Modern pastel altın
- **Accent Mint**: `#2A9D8F` - Fresh mint yeşil

### Temalar

- **Light Mode**: Temiz, aydınlık tasarım
- **Dark Mode**: Göz yormaayan koyu tasarım
- **System**: Cihaz temasını takip eder

## 🗺️ Navigation Yapısı

```
RootStack
├── Auth (Giriş yapmamış kullanıcılar)
└── MainTabs (Giriş yapmış kullanıcılar)
    ├── Explore (Ana sayfa)
    ├── Favorites (Favoriler)
    ├── Map (Harita)
    └── Profile (Profil)
```

## 📚 State Management

### Zustand Stores

- **AppStore**: Kullanıcı durumu, kimlik doğrulama, tercihler
- **UIStore**: UI state'leri, modal kontrolleri, geçici veriler

### React Query

- API çağrıları için cache ve server state yönetimi
- Offline-first yaklaşım için optimistic updates

## 🌐 Internationalization (i18n)

- **react-i18next** kullanılarak çok dilli destek
- Desteklenen diller: Türkçe (tr), İngilizce (en)
- Namespace'li çeviri organizasyonu

## 📱 Development Workflow

### Hot Reload & Fast Refresh

```bash
# Metro bundler ile hot reload
npx react-native start

# Fiziksel cihazda test
# Cihazı USB ile bağlayın ve USB debugging'i etkinleştirin
adb devices  # Cihazı kontrol edin
npx react-native run-android
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Testing
npm test
```

## 📞 İletişim

- **Proje**: TravelTurkey
- **Email**: info@travelturkey.app
- **Website**: https://travelturkey.app

---

**Made with ❤️ in Turkey 🇹🇷**
