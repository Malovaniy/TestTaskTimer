import { Component, OnInit } from '@angular/core';
import { ITime } from 'src/app/shared/interface/time.interface';
import { TimeService } from 'src/app/shared/timeService/time.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  public interv!: any
  public isStart = true
  public time: ITime = { sec: 0, min: 0 }
  public firstclick!: number
  public twoclick!: number
  public result!: number
  public isTwoClick = false

  constructor(private timeServices: TimeService) { }

  ngOnInit(): void {
  }

  start() {
    if (this.isStart) {
      this.interv = setInterval(() => {
        this.timeServices.start().subscribe(e => {
          this.time.sec = e.sec
          this.time.min = e.min
          this.isStart = false
        }, err => {
          console.log(err);

        })
      }, 1000)
    }
    else {
      this.isStart = true
      clearInterval(this.interv)
      this.timeServices.reset().subscribe(e => {
        this.time.sec = e.sec
        this.time.min = e.min
      })
    }
  }

  wait(event: any): void {
    if (this.isTwoClick) {
      this.isTwoClick = false
      this.twoclick = event.timeStamp
      this.result = this.twoclick - this.firstclick
      if(this.result <= 500){  
        console.log(this.result);
        clearInterval(this.interv)
        this.isStart = true
      }
    }
    if (!this.isTwoClick) {
      this.firstclick = event.timeStamp
      this.isTwoClick =true
    } 
  }

  reset() {
    this.timeServices.reset().subscribe(e => {
      this.time.sec = e.sec
      this.time.min = e.min
    })
  }

}