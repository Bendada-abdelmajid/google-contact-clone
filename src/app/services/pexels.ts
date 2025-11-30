import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PexelsService {
  private http = inject(HttpClient);
  private API_URL = 'https://api.pexels.com/v1/search';
  private API_KEY = "w6wPgpdMz577w7H6IUJZHiTETXdTReGZFLYd6sTxTKRbrIaAcOYRKww0"; 

  getAvatars(query = 'cats', perPage = 12) {
    const headers = new HttpHeaders({ Authorization: this.API_KEY });
    return this.http.get<any>(this.API_URL, {
      headers,
      params: { query, per_page: perPage },
    });
  }
}
