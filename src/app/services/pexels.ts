import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'dotenv/config';
@Injectable({ providedIn: 'root' })
export class PexelsService {
  private http = inject(HttpClient);
  private API_URL = 'https://api.pexels.com/v1/search';
  private API_KEY = process.env['API_KEY'] ?? ""; 

  getAvatars(query = 'cats', perPage = 12) {
    const headers = new HttpHeaders({ Authorization: this.API_KEY });
    return this.http.get<any>(this.API_URL, {
      headers,
      params: { query, per_page: perPage },
    });
  }
}
