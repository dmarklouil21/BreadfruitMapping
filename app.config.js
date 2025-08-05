import 'dotenv/config';

export default {
  expo: {
    name: "Breadfruit Tracker",
    slug: "BreadfruitMapping",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/bm-icon.png",
    scheme: "breadfruitmapping",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/bm-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      package: "com.dmarklouil21.BreadfruitMapping"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/bm-icon.png"
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission: "Allow KULO to access your photos",
          cameraPermission: "Allow KULO to access your camera"
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow KULO to access your camera"
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow KULO to use your location"
        }
      ],
      "expo-router",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/bm-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "48e90659-9b1a-4d79-b772-9c66a19ea58e"
      }, 
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    },
    owner: "dmarklouil21"
  }
};