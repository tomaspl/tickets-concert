import { Component, OnInit } from '@angular/core'
import { FamilyService } from '../../shared/family.service'
import { AppService } from '../../shared/app.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'waiting-room-page',
  standalone: true,
  imports: [],
  templateUrl: './waiting-room-page.component.html',
  styleUrl: './waiting-room-page.component.css',
})
export class WaitingRoomPageComponent implements OnInit {
  public amountOfPeople = 0
  private queueUnsubscribe: any
  private invalidated = false
  private waitingSub!: Subscription
  constructor(
    private familyService: FamilyService,
    private appService: AppService,
  ) {}
  ngOnInit() {
    // If we had been invalidated previously on this device, restore that state
    // but only keep it if the family is currently in stage (onStageAt active).
    try {
      const key = `invalidated_${this.familyService.familyId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        // check DB to see if onStageAt is still active
        this.familyService.getQueueOnStageAt().then((onStageAt) => {
          const now = this.familyService.getServerNow()
          const totalAllowed = 2 * 60 * 1000
          if (onStageAt && now - onStageAt < totalAllowed) {
            this.invalidated = true
            this.appService.setError(
              'Esta sesión fue invalidada por otro dispositivo.',
            )
            this.appService.changePage('error' as any)
          } else {
            try {
              localStorage.removeItem(key)
            } catch (e) {}
          }
        })
      }
    } catch (e) {
      // ignore localStorage errors
    }

    this.familyService.peopleBeforeMe$.subscribe((response) => {
      this.amountOfPeople = response
    })

    this.waitingSub = this.familyService.ticketStage$.subscribe((response) => {
      // Only navigate to stage if we are not invalidated locally
      if (response && !this.invalidated) {
        this.appService.changePage('stage')
      }
    })

    this.putFamilyInQueue()
    // Watch own queue node to detect session changes made by other devices
    this.queueUnsubscribe = this.familyService.watchQueueEntry((snap: any) => {
      if (!snap.exists()) return
      const val = snap.val()
      const localAt = this.familyService.getLocalSessionAt()
      const localId = this.familyService.getLocalSessionId()
      const dbAt = val.sessionAt || null
      const dbId = val.sessionId || null
      const onStageAt = val.onStageAt || null
      const now = this.familyService.getServerNow()
      const totalAllowed = 2 * 60 * 1000

      // 1) Last-device-wins: si DB tiene sessionAt más reciente -> invalidada
      // Persist only if there's an active onStageAt (we want persistence only while someone is on stage)
      if (localAt && dbAt && dbAt > localAt) {
        const sameSession =
          (localAt && dbAt && localAt === dbAt) ||
          (this.familyService.getLocalSessionId() &&
            dbId &&
            this.familyService.getLocalSessionId() === dbId)
        if (onStageAt && now - onStageAt < totalAllowed && !sameSession) {
          this.invalidated = true
          try {
            localStorage.setItem(
              `invalidated_${this.familyService.familyId}`,
              JSON.stringify({ sessionAt: dbAt, at: now }),
            )
          } catch (e) {}
          this.waitingSub.unsubscribe()
          this.appService.setError(
            'Esta sesión fue invalidada por otro dispositivo.',
          )
          this.appService.changePage('error' as any)
          return
        }
        // If no onStageAt active, treat invalidation as transient: show error but don't persist
        if (!onStageAt || now - onStageAt >= totalAllowed) {
          this.appService.setError(
            'Esta sesión fue invalidada por otro dispositivo.',
          )
          this.waitingSub.unsubscribe()
          this.appService.changePage('error' as any)
          return
        }
      }

      // 2) Si la familia ya está en stage (onStageAt activo) y no es nuestra sesión -> invalidada
      if (onStageAt && now - onStageAt < totalAllowed) {
        const sameSession =
          (localAt && dbAt && localAt === dbAt) ||
          (localId && dbId && localId === dbId)
        if (!sameSession) {
          this.invalidated = true
          try {
            localStorage.setItem(
              `invalidated_${this.familyService.familyId}`,
              JSON.stringify({ onStageAt, at: now }),
            )
          } catch (e) {}
          this.appService.setError(
            'La familia ya está en stage en otro dispositivo.',
          )
          this.appService.changePage('error' as any)
          return
        }
      }
    })
  }

  async checkFamilyAtQueue() {
    const isAtQueue = await this.familyService.familyOnQueue(
      this.familyService.familyId,
    )
    return isAtQueue
  }

  async putFamilyInQueue() {
    // Intentar (re)registrar la familia en cualquier caso: esto actualizará
    // el `sessionId` en la base y dejará `enteredAt` intacto si ya existía.
    const ok = await this.familyService.registerFamily()
    if (!ok) return // registerFamily mostró toaster o falló
    // On successful register, clear any local invalidation for this family
    try {
      localStorage.removeItem(`invalidated_${this.familyService.familyId}`)
    } catch (e) {}
    this.invalidated = false
    this.familyService.detectChangeOnQueue()
  }

  ngOnDestroy() {
    if (this.queueUnsubscribe) this.queueUnsubscribe()
  }
}
