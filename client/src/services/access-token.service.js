import { storageService } from './storage.service';

const TOKEN_STORAGE_KEY = `ACCESS_TOKEN`;

function getToken() {
  // console.log(storageService.getItem(TOKEN_STORAGE_KEY));
  return storageService.getItem(TOKEN_STORAGE_KEY);
}

function setToken(token) {
  // console.log(storageService.getItem(TOKEN_STORAGE_KEY));
  return storageService.setItem(TOKEN_STORAGE_KEY, token);
}

function removeToken() {
  return storageService.removeItem(TOKEN_STORAGE_KEY);
}

export const accessTokenService = {
  getToken,
  setToken,
  removeToken
};
