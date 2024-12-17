import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Advertisement } from '../../shared/models/advertisement';
import { BoardParams } from '../../shared/models/boardParams';
import { Pagination } from '../../shared/models/pagination';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  baseUrl = 'https://localhost:5001/api/'
  private http = inject(HttpClient);
  private userService = inject(UserService);
  locations: string[] = [];
  categories: string[] = [];

  getAdvertisement(id: number) {
    return this.http.get<Advertisement>(this.baseUrl + 'advertisements/' + id);
  }

  getAdvertisements(boardParams: BoardParams) {
    let params = new HttpParams();

    if (boardParams.categories.length > 0) {
      params = params.append('categories', boardParams.categories.join(','));
    }

    if (boardParams.locations.length > 0) {
      params = params.append('locations', boardParams.locations.join(','));
    }

    if (boardParams.sort) {
      params = params.append('sort', boardParams.sort);
    }

    if (boardParams.search) {
      params = params.append('search', boardParams.search);
    }

    params = params.append('pageSize', boardParams.pageSize);
    params = params.append('pageIndex', boardParams.pageNumber);

    return this.http.get<Pagination<Advertisement>>(this.baseUrl + 'advertisements', {params});
  }

  getCategories() {
    if (this.categories.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'advertisements/categories').subscribe({
      next: response => this.categories = response
    })
  }

  getLocations() {
    if (this.locations.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'advertisements/locations').subscribe({
      next: response => this.locations = response
    })
  }

  isOwner(advertisement: Advertisement): boolean {
    const currentUserEmail = this.userService.getUserEmail();
    return advertisement.authorEmail === currentUserEmail;
  }

  // Add new advertisement
  createAdvertisement(advertisement: Advertisement) {
    this.userService.setUserEmail(advertisement.authorEmail);
    return this.http.post<Advertisement>(this.baseUrl + 'advertisements', advertisement);
  }

  // Update existing advertisement
  updateAdvertisement(id: number, advertisement: Advertisement) {
    return this.http.put<Advertisement>(this.baseUrl + 'advertisements/' + id, advertisement);
  }

  // Delete advertisement
  deleteAdvertisement(id: number) {
    return this.http.delete(this.baseUrl + 'advertisements/' + id);
  }
}
