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
  private apiUrl = 'https://7h1t7fmen5.execute-api.eu-central-1.amazonaws.com/';

  constructor(private httpClient: HttpClient) {}

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
