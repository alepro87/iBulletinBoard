import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_EMAIL_COOKIE = 'userEmail';
  
  constructor(private cookieService: CookieService) {}

  setUserEmail(email: string) {
    this.cookieService.setCookie(this.USER_EMAIL_COOKIE, email, 7); // Stores for 7 days
  }

  getUserEmail(): string | null {
    return this.cookieService.getCookie(this.USER_EMAIL_COOKIE);
  }

  clearUserEmail() {
    this.cookieService.deleteCookie(this.USER_EMAIL_COOKIE);
  }

  isLoggedIn(): boolean {
    return !!this.getUserEmail();
  }
}
