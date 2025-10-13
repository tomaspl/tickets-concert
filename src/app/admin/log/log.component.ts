import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Subscription, interval } from 'rxjs'
import { getDatabase, ref, onValue, DataSnapshot } from 'firebase/database'
import app from '../../../firebase'
import { AppService } from '../../shared/app.service'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'
//import app from '../../firebase'

interface LogEvent {
  time: number
  titulo: string
}

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, TailwindClassDirective],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css',
})
export class LogComponent implements OnInit, OnDestroy {
  logList: LogEvent[] = []
  now: number = Date.now()
  private sub?: Subscription

  constructor(private appService: AppService) {}

  ngOnInit() {
    const db = getDatabase(app)
    const logRef = ref(db, '/log')
    onValue(logRef, (snapshot: DataSnapshot) => {
      const arr: LogEvent[] = []
      snapshot.forEach((child) => {
        const val = child.val()
        arr.push({ time: val.time, titulo: val.titulo })
      })
      // Ordenar del más reciente al más antiguo
      this.logList = arr.sort((a, b) => b.time - a.time)
    })
    this.sub = interval(1000).subscribe(() => {
      this.now = Date.now()
    })
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

  getTimeAgo(ts: number): string {
    const diff = Math.floor((this.now - ts) / 1000)
    const min = Math.floor(diff / 60)
    const sec = diff % 60
    return `${min}m ${sec < 10 ? '0' : ''}${sec}s`
  }

  getTime(ts: number): string {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  resetLog() {
    this.appService.resetLog()
  }
}
