import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type TriggerMessage = {
  originTopic: string;
  payload: Record<string, any>;
};

@Injectable({
  providedIn: 'root',
})
export class TriggerService {
  private apiUrl = 'https://api.termite-home.xyz';

  constructor(private httpClient: HttpClient) {}

  message(deviceFriendlyName: string, message: any) {
    return this.httpClient.post(`${this.apiUrl}/topics/${deviceFriendlyName}`, message);
  }

  trigger(originTopic: string, action: string): Observable<any> {
    const payload: TriggerMessage = {
      originTopic,
      payload: {
        action,
      },
    };

    return this.httpClient.post(`${this.apiUrl}/trigger`, payload);
  }
}
