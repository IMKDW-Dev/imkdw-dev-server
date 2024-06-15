// eslint-disable-next-line import/prefer-default-export
export const parseRefreshTokenByCookie = (cookies: string): string => {
  if (!cookies) return '';

  const tokenCookies: { [key: string]: string } = {};

  cookies.split(';').forEach((_cookie: string) => {
    const trimCookie = _cookie.trim();
    const mid = trimCookie.indexOf('=');
    const [key, value] = [trimCookie.slice(0, mid), trimCookie.slice(mid + 1)];
    tokenCookies[key] = value;
  });

  const refreshToken = tokenCookies?.refreshToken || '';

  return refreshToken;
};
