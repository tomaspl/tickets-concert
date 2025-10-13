import { Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FamilyService } from '../../shared/family.service'
import { Subscription, combineLatest, interval } from 'rxjs'
import { AppService } from '../../shared/app.service'
import { TailwindClassDirective } from '../../shared/directives/tailwind-class.directive'

interface QueueFamily {
  familyId: string
  lastName: string
  availableSeats: number
  enteredAt: number
  onStageAt?: number
}

@Component({
  selector: 'app-cola',
  standalone: true,
  imports: [CommonModule, TailwindClassDirective],
  templateUrl: './cola.component.html',
  styleUrl: './cola.component.css',
})
export class ColaComponent implements OnInit, OnDestroy {
  families: Record<string, any> = {}
  queue: Record<string, any> = {}
  queueList: QueueFamily[] = []
  stageFamily: QueueFamily | null = null
  now: number = Date.now()
  private sub?: Subscription

  constructor(
    private familyService: FamilyService,
    private appService: AppService,
  ) {}

  ngOnInit() {
    this.sub = combineLatest([
      this.familyService.families$,
      this.familyService.queue$,
      interval(1000),
    ]).subscribe(([families, queue]) => {
      this.families = families
      this.queue = queue
      this.now = Date.now()
      this.updateQueueList()
    })
    this.familyService.fetchFamilies()
    this.familyService.detectChangeOnQueue()
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

  updateQueueList() {
    const queueArr: QueueFamily[] = []
    let stage: QueueFamily | null = null
    for (const familyId in this.queue) {
      const q = this.queue[familyId]
      const fam = this.families[familyId]
      if (!fam || !q) continue
      const obj: QueueFamily = {
        familyId,
        lastName: fam.lastName,
        availableSeats: fam.availableSeats,
        enteredAt: q.enteredAt,
        onStageAt: q.onStageAt,
      }
      if (q.onStageAt) {
        if (!stage || q.onStageAt < (stage.onStageAt || 0)) stage = obj
      } else {
        queueArr.push(obj)
      }
    }
    this.queueList = queueArr.sort((a, b) => a.enteredAt - b.enteredAt)
    this.stageFamily = stage
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

  resetCola() {
    this.appService.removeQueue()
  }
}
