import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly EXPIRATION_KEY = 'token_expiration';
  private readonly USER_ID_KEY = 'userId';

  constructor(private cookieService: CookieService) {}

  getToken(): string | undefined {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    const expiresInSeconds = 3600; // 1 hour in seconds
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + expiresInSeconds * 1000);

    this.cookieService.set(this.TOKEN_KEY, token, expiresInSeconds, '/', '', false, 'Strict');
    this.cookieService.set(this.EXPIRATION_KEY, expirationTime.toISOString(), expiresInSeconds, '/', '', false, 'Strict');
  }


  isTokenExpired(): boolean {
    const expirationTime = this.cookieService.get(this.EXPIRATION_KEY);
    if (expirationTime) {
      const now = new Date().getTime();
      return new Date(expirationTime).getTime() < now;
    }
    return true; // No expiration time or expired
  }

  getUserId(): string | undefined {
    return this.cookieService.get(this.USER_ID_KEY);
  }

  setUserId(userId: string): void {
    this.cookieService.set(this.USER_ID_KEY, userId, undefined, '/', '', false, 'Strict');
  }
/*
  setPicture(url:string){
    const encodedUrl = encodeURIComponent(url);
    this.cookieService.set('picture', encodedUrl, undefined, '/', '', false, 'Strict');

  }
  getPicture(){
    const encodedUrl = this.cookieService.get('picture');
    if (encodedUrl) {
      return decodeURIComponent(encodedUrl);
    } else {
      return null;
    }
  }
  */

  clearToken(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/', '');
    this.cookieService.delete(this.EXPIRATION_KEY, '/', '');
    this.cookieService.delete(this.USER_ID_KEY, '/', '');
    /*this.cookieService.delete('picture', '/', '');*/
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
