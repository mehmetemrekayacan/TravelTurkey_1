declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_MAPS_API_KEY: string;
    NODE_ENV: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
