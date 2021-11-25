import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITime } from '../interface/time.interface';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private url = environment.BACKEND_URL;
  private api = { time: `${this.url}/time` };


  public interv!: any
  public isStart = true
  public time: ITime = { min: 0, sec: 0 }
  constructor(private http: HttpClient) { }

  start(): Observable<ITime> {
    this.time.sec++
    if (this.time.sec === 60) {
      this.time.min++
      this.time.sec = 0
    }
    return this.http.post<ITime>(this.api.time, this.time);
  }

  reset(): Observable<ITime> {
    this.time = {
      min: 0,
      sec: 0
    }
    return this.http.post<ITime>(this.api.time, this.time);
  }
}