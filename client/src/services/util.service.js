export function makeId(length = 14) {
  let id = '';
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    id += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return id;
}

export function isDev() {
  return process.env.NODE_ENV === 'development';
}
