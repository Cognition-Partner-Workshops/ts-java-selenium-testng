export const APP_URL = process.env.GXCAPTURE_URL || 'https://gxcapture-redbird-dc.galaxe.com:6500/portal#/';
export const USERNAME = process.env.GXCAPTURE_USERNAME || '';
export const PASSWORD = process.env.GXCAPTURE_PASSWORD || '';
export const TEST_USER_PASSWORD = process.env.GXCAPTURE_TEST_USER_PASSWORD || 'GxAuto@12345';
export const GATEWAY_PATTERN = /\/gxcapturegateway\//;

export function portalUrl(path: string): string {
  return new URL(path, APP_URL).toString();
}

export function timestampForName(): string {
  return new Date().toISOString().replace(/\D/g, '').slice(2, 14);
}
