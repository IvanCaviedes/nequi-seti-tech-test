export type SplashStatus = 'loading' | 'navigating';

export interface SplashState {
  loading: number;
  dots: string;
  status: SplashStatus;
}
