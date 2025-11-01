import { Injectable } from '@angular/core'
import {
  getDatabase,
  ref,
  push,
  update,
  onValue,
  get,
  remove,
  query,
  orderByChild,
} from 'firebase/database'
import app from '../../firebase'
import { BehaviorSubject, Observable } from 'rxjs'
import { SectionStage } from '../model/SectionStage'
import { sanitizeMap } from '../utils/map'
import { Reservation } from '../model/Reservation'
import { Seat } from '../model/Seat'
import { ActivatedRoute } from '@angular/router'
import { ToasterService } from './toaster.service'
import { messageTicketsPerFamily, seatsPerFamily } from '../constants'
import { AppService } from './app.service'
import { familyData } from '../utils/familyData'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private queue: BehaviorSubject<any> = new BehaviorSubject<any>({})
  public queue$: Observable<any> = this.queue.asObservable()
  private rtdb = getDatabase(app)
  private serverOffset = 0
  private localSessionId: string | null = null
  private localSessionAt: number | null = null
  private familyRefUnsubscribe: (() => void) | null = null

  private ticketStage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  )
  public ticketStage$: Observable<boolean> = this.ticketStage.asObservable()
  private peopleBeforeMe: BehaviorSubject<number> = new BehaviorSubject<number>(
    0,
  )
  public peopleBeforeMe$: Observable<number> =
    this.peopleBeforeMe.asObservable()
  private stageMap: BehaviorSubject<SectionStage[]> = new BehaviorSubject<
    SectionStage[]
  >([])
  public stageMap$: Observable<SectionStage[]> = this.stageMap.asObservable()

  private families: BehaviorSubject<any> = new BehaviorSubject<any>({})
  public families$: Observable<any> = this.families.asObservable()

  private availableSeats: BehaviorSubject<number> = new BehaviorSubject<number>(
    0,
  )
  public availableSeats$: Observable<number> =
    this.availableSeats.asObservable()

  public seatsPerFamily = seatsPerFamily
  public familyCode!: number

  private lastName: BehaviorSubject<string> = new BehaviorSubject<string>('')
  public lastName$: Observable<string> = this.lastName.asObservable()

  private preventa: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  )
  public preventa$: Observable<boolean> = this.preventa.asObservable()

  public selectedSeats = new Set()

  private details: BehaviorSubject<Reservation[] | null> = new BehaviorSubject<
    Reservation[] | null
  >(null)
  public details$: Observable<Reservation[] | null> =
    this.details.asObservable()
  public familyId!: string
  constructor(
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private appService: AppService,
    private http: HttpClient,
  ) {
    this.familyId = this.route.snapshot.paramMap.get('id') || ''
    this.listenServerTimeOffset()
  }

  /**
   * Agrega un evento al log en Firebase
   * @param titulo string con el mensaje del evento
   */
  public addLogEvent(titulo: string) {
    const logRef = ref(this.rtdb, '/log/')
    const event = {
      time: Date.now(),
      titulo: titulo,
    }
    push(logRef, event)
      .then(() => {})
      .catch((err) => {
        console.error('Error escribiendo en el log:', err)
      })
  }

  private isValidKey(key: string) {
    if (!key) return false
    // Realtime Database disallows these characters in keys: . # $ [ ] /
    return !/[.#$\[\]\/]/.test(key)
  }

  /** Mantiene serverOffset usando .info/serverTimeOffset */
  listenServerTimeOffset() {
    try {
      const offsetRef = ref(this.rtdb, '.info/serverTimeOffset')
      onValue(
        offsetRef,
        (snap) => {
          if (snap.exists()) {
            this.serverOffset = snap.val() || 0
          }
        },
        { onlyOnce: false },
      )
    } catch (e) {
      console.error('No se pudo leer serverTimeOffset', e)
    }
  }

  getServerNow(): number {
    return Date.now() + (this.serverOffset || 0)
  }

  getCurrentPage() {
    return this.appService.currentPage$
  }

  setFamilyId(id: string) {
    // detach previous listener if any
    if (this.familyRefUnsubscribe) {
      try {
        this.familyRefUnsubscribe()
      } catch (e) {
        // ignore
      }
      this.familyRefUnsubscribe = null
    }

    this.familyId = (id || '').trim()
    if (!this.isValidKey(this.familyId)) {
      console.warn('familyId inválido:', id)
      this.familyId = ''
      return
    }
    try {
      const stored = localStorage.getItem(`session_${id}`)
      if (stored) this.localSessionId = stored
      const storedAt = localStorage.getItem(`sessionAt_${id}`)
      if (storedAt) this.localSessionAt = Number(storedAt)
    } catch (e) {
      // ignore localStorage errors
    }
  }

  listenIfTheatreIsOpen() {
    const queueRef = ref(this.rtdb, `/theatreIsOpen/`)
    onValue(
      queueRef,
      (snapshot) => {
        if (snapshot.exists()) {
          this.appService.theatreIsOpen.next(snapshot.val())
        }
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      },
    )
  }

  familyOnSchool(familyId: string) {
    this.setFamilyId(familyId)
    const familiesRef = ref(this.rtdb, 'families/' + familyId)
    return get(familiesRef)
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          const val = snapshot.val()
          this.availableSeats.next(val.availableSeats)
          this.familyCode = val.familyCode
          this.lastName.next(val.lastName)
          this.preventa.next(val.preventa)
          // Attach a realtime listener so the values update on any change
          try {
            this.familyRefUnsubscribe = this.watchFamily(familyId)
          } catch (e) {
            // ignore listener attach errors
          }
          return true
        } else {
          return false
        }
      })
      .catch((error) => {
        return false
      })
  }

  /**
   * Start listening in realtime to `/families/{familyId}`. Returns the unsubscribe function.
   * If called when another family listener is active, the previous listener will be detached first.
   */
  watchFamily(familyId?: string): () => void {
    const id = familyId || this.familyId
    if (!id) return () => {}

    // detach previous listener if present
    if (this.familyRefUnsubscribe) {
      try {
        this.familyRefUnsubscribe()
      } catch (e) {}
      this.familyRefUnsubscribe = null
    }

    const familyRef = ref(this.rtdb, 'families/' + id)
    const unsubscribe = onValue(
      familyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val()
          if (val.availableSeats !== undefined)
            this.availableSeats.next(val.availableSeats)
          if (val.familyCode !== undefined) this.familyCode = val.familyCode
          if (val.lastName !== undefined) this.lastName.next(val.lastName)
          if (val.preventa !== undefined) this.preventa.next(val.preventa)
        }
      },
      { onlyOnce: false },
    )

    // store and return
    this.familyRefUnsubscribe = unsubscribe
    return unsubscribe
  }

  /** Detach the current families/{familyId} listener if present */
  unwatchFamily() {
    if (this.familyRefUnsubscribe) {
      try {
        this.familyRefUnsubscribe()
      } catch (e) {}
      this.familyRefUnsubscribe = null
    }
  }

  familyOnQueue(familyId: string) {
    const queueRef = ref(this.rtdb, `queue/${familyId}`)
    return get(queueRef)
      .then((snapshot: any) => {
        return snapshot.exists()
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Registra una familia en la cola de espera.
   * @returns {Promise<boolean>} Indica si el registro fue exitoso.
   */
  registerFamily(): Promise<boolean> {
    // Validar familyId antes de construir referencias en RTDB
    if (!this.familyId || !this.isValidKey(this.familyId)) {
      console.error('registerFamily: familyId inválido:', this.familyId)
      try {
        this.toasterService.showToaster('Identificador de familia inválido.')
      } catch (e) {}
      return Promise.resolve(false)
    }

    // Generar sessionId y sessionAt inmediatamente y persistirlos localmente
    this.familyId = (this.familyId || '').trim()
    if (!this.isValidKey(this.familyId)) {
      console.error(
        'registerFamily: familyId inválido después de trim:',
        JSON.stringify(this.familyId),
      )
      try {
        this.toasterService.showToaster('Identificador de familia inválido.')
      } catch (e) {}
      return Promise.resolve(false)
    }

    const sessionId = `${this.familyId}_${Math.random().toString(36).slice(2)}`
    const sessionAt = this.getServerNow()
    this.localSessionId = sessionId
    this.localSessionAt = sessionAt
    try {
      localStorage.setItem(`session_${this.familyId}`, sessionId)
      localStorage.setItem(`sessionAt_${this.familyId}`, String(sessionAt))
    } catch (e) {
      // Ignorar errores de cuota/localStorage
    }

    // Intentar operar directamente sobre `/queue/{familyId}` y capturar errores
    return Promise.resolve()
      .then(() => {
        let userStatusDatabaseRef: any
        try {
          userStatusDatabaseRef = ref(this.rtdb, `/queue/${this.familyId}`)
        } catch (err) {
          console.error(
            'registerFamily: error creating ref for familyId=',
            JSON.stringify(this.familyId),
            err,
          )
          try {
            this.toasterService.showToaster(
              'Identificador de familia inválido.',
            )
          } catch (e) {}
          return false
        }

        // Leer el estado actual de la cola para la familia
        return get(userStatusDatabaseRef)
          .then((snap: any) => {
            if (snap.exists()) {
              const val = snap.val()
              const onStageAt = val.onStageAt || null

              // Verificar si la familia ya está en stage y no expiró
              if (onStageAt) {
                const now = this.getServerNow()
                const totalAllowed = 2 * 60 * 1000 // 2 minutos permitidos
                if (now - onStageAt < totalAllowed) {
                  this.toasterService.showToaster(
                    'La familia ya está en stage en otro dispositivo.',
                  )
                  this.addLogEvent(
                    `Familia ${this.lastName.value} cambia de dispositivo.`,
                  )

                  return false
                }
              }
            }

            // Preparar datos para actualizar la cola
            let enteredAt = Date.now()
            if (snap.exists()) {
              const val = snap.val()
              if (val.enteredAt) enteredAt = val.enteredAt
            }
            const postData: any = {
              familyId: this.familyId,
              enteredAt,
              sessionId,
              sessionAt,
            }
            // Loguear ingreso a la cola
            this.addLogEvent(
              `Familia ${this.lastName.value} ingresa al sistema, va a la cola de espera`,
            )

            // Actualizar la cola con los datos de la familia
            return update(userStatusDatabaseRef, postData).then(() => true)
          })
          .catch((err) => {
            console.error('Error leyendo/actualizando la cola:', err)
            return false
          })
      })
      .catch((err) => {
        console.error('registerFamily unexpected error:', err)
        return false
      })
  }

  getLocalSessionId() {
    return this.localSessionId
  }

  getLocalSessionAt() {
    return this.localSessionAt
  }

  detectChangeOnQueue() {
    const queueRef = ref(this.rtdb, `/queue/`)
    const q = query(queueRef, orderByChild('enteredAt'))
    onValue(
      q,
      (snapshot) => {
        if (snapshot.exists()) {
          const items: any[] = []
          snapshot.forEach((childSnapshot: any) => {
            const val = childSnapshot.val()
            items.push({ key: childSnapshot.key, ...val })
          })
          // Map to { [familyId]: { ...data } }
          const queueObj: Record<string, any> = {}
          items.forEach((item) => {
            if (item.familyId) queueObj[item.familyId] = item
          })
          this.queue.next(queueObj)
          // items already ordered by enteredAt due to the query
          const first = items[0]
          const isItFirst = first && first.familyId === this.familyId
          if (isItFirst && first && !first.onStageAt) {
            const onStageRef = ref(this.rtdb, `/queue/${first.key}`)
            update(onStageRef, { onStageAt: Date.now() })
              .then(() => {
                // Loguear ingreso al mapa del teatro
                this.addLogEvent(
                  `Familia ${this.lastName.value} ingresa al mapa del teatro.`,
                )
              })
              .catch((err) => {
                console.error('Error setting onStageAt:', err)
              })
          }
          if (!isItFirst) {
            const index = items.findIndex(
              (it: any) => it.familyId === this.familyId,
            )
            this.peopleBeforeMe.next(index === -1 ? 0 : index)
          } else {
            this.peopleBeforeMe.next(0)
          }
          this.ticketStage.next(isItFirst)
        } else {
          this.ticketStage.next(false)
          this.peopleBeforeMe.next(0)
        }
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      },
    )
  }

  /** Devuelve onStageAt si existe */
  getQueueOnStageAt(familyId?: string): Promise<number | null> {
    const id = familyId || this.familyId
    if (!id) return Promise.resolve(null)
    const entryRef = ref(this.rtdb, `queue/${id}`)
    return get(entryRef)
      .then((snapshot: any) => {
        if (!snapshot.exists()) return null
        const val = snapshot.val()
        if (val.onStageAt) return val.onStageAt
        return null
      })
      .catch(() => null)
  }

  /**
   * Observa el nodo /queue/{familyId}. Devuelve la función de unsubscribe.
   * callback recibe el snapshot (como en onValue).
   */
  watchQueueEntry(callback: (snapshot: any) => void) {
    const id = this.familyId
    if (!id) return () => {}
    const nodeRef = ref(this.rtdb, `queue/${id}`)
    const unsubscribe = onValue(nodeRef, (snap) => callback(snap))
    return unsubscribe
  }

  removeFromSelectionDetail(sectionName: string, seat: Seat | null) {
    if (!seat) return
    if (!this.details.value) return
    this.details.next(
      this.details.value.filter((item) => {
        return !(
          item.sectionName === sectionName &&
          item.seat === seat.seat &&
          item.row === seat.row
        )
      }),
    )
  }
  addToSelectionDetail(sectionName: string, seat: Seat | null) {
    if (!this.details.value) return
    if (seat) {
      this.details.next([
        ...this.details.value,
        {
          sectionName: sectionName,
          seat: seat.seat,
          row: seat.row,
        },
      ])
    }
  }

  fetchStageMap(id?: string) {
    const seatsRef = ref(this.rtdb, `/seats/`)

    // Listener para cambios en la referencia /queue/
    onValue(
      seatsRef,
      (snapshot) => {
        if (id) this.familyId = id
        if (snapshot.exists()) {
          const toJSON = snapshot.toJSON() as any
          const sanitizeMaptoJSON = sanitizeMap(toJSON)
          this.stageMap.next(sanitizeMaptoJSON)
          const details = [] as any
          sanitizeMaptoJSON.forEach((stage) => {
            stage.seats?.forEach((row) => {
              row.forEach((seat) => {
                if (seat.familyId === this.familyId) {
                  details.push({
                    sectionName: stage.sectionName,
                    seat: seat.seat,
                    row: seat.row,
                  })
                }
              })
            })
          })
          this.details.next(details)
        }
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      },
    )
  }

  downloadReport(filename: string, type: string) {
    const seatsRef = ref(this.rtdb, `/`)

    onValue(
      seatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const main = snapshot.val()
          const sections = Object.keys(main.seats)
          let data: any[] = []
          sections.forEach((section) => {
            main.seats[section].forEach((seat: any) => {
              data.push({
                familyCode: seat.familyCode,
                lastName: seat.lastName,
                section,
                row: seat.row ? seat.row : '',
                seat: seat.seat,
              })
            })
          })
          data = data
            .filter((elem) => elem.familyCode)
            .sort((a, b) => {
              if (a.familyCode > b.familyCode) return 1
              if (a.familyCode < b.familyCode) return -1
              return 0
            })

          const headers = 'Codigo de familia,Apellido,Seccion,Fila,Asiento'
          const rows = data.map(
            (row) =>
              `${row.familyCode},${row.lastName},${row.section},${row.row},${row.seat}`,
          )
          const csvContent = [headers, ...rows].join('\n')
          const blob = new Blob([csvContent], { type })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          a.click()
          window.URL.revokeObjectURL(url)
        }
      },
      {
        onlyOnce: true, // Configurar para escuchar cambios en tiempo real
      },
    )
  }

  fetchFamilies() {
    const seatsRef = ref(this.rtdb, `/families/`)
    // Listener para cambios en la referencia /queue/
    onValue(
      seatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const toJSON = snapshot.toJSON() as any
          //const sanitizeMaptoJSON = sanitizeMap(toJSON);
          this.families.next(toJSON)
        }
      },
      {
        onlyOnce: false, // Configurar para escuchar cambios en tiempo real
      },
    )
  }

  /**
   * Devuelve el timestamp enteredAt de la entrada en /queue para la familia
   * Si no existe devuelve null
   */
  getQueueEnteredAt(familyId?: string): Promise<number | null> {
    const id = familyId || this.familyId
    if (!id) return Promise.resolve(null)
    const entryRef = ref(this.rtdb, `queue/${id}`)
    return get(entryRef)
      .then((snapshot: any) => {
        if (!snapshot.exists()) return null
        const val = snapshot.val()
        // El nodo puede ser { familyId, enteredAt } o { <familyId>: true, enteredAt }
        if (val.enteredAt) return val.enteredAt
        const keys = Object.keys(val).filter((k) => k !== 'enteredAt')
        return keys.length > 0 ? val.enteredAt || null : null
      })
      .catch(() => null)
  }

  removeFromQueue() {
    const userStatusDatabaseRef = ref(this.rtdb, `/queue/${this.familyId}`)
    remove(userStatusDatabaseRef)
      .then(() => {})
      .catch((error) => {
        console.error('Error al eliminar la referencia:', error)
      })
  }

  reservateSeats() {
    const updates = {} as any
    updates['/families/' + this.familyId + '/availableSeats'] =
      this.availableSeats.value
    const seatsAdquiridos: string[] = []
    this.selectedSeats.forEach((seat: any) => {
      updates['/seats/' + seat.sectionName + '/' + seat.id + '/familyCode'] =
        this.familyCode
      updates['/seats/' + seat.sectionName + '/' + seat.id + '/familyId'] =
        this.familyId
      updates['/seats/' + seat.sectionName + '/' + seat.id + '/lastName'] =
        this.lastName.value
      // Construir string de asiento adquirido
      let desc = seat.sectionName.split('-')[1] + ': '
      if (Boolean(seat.row) && Boolean(seat.seat)) {
        desc += 'fila ' + seat.row + ', '
        desc += 'asiento ' + seat.seat
        seatsAdquiridos.push(desc)
      } else {
        desc += 'palco ' + seat.seat
      }
    })
    // Loguear adquisición de entradas
    if (seatsAdquiridos.length > 0) {
      const titulo = `Familia ${this.lastName.value} ha adquirido ${seatsAdquiridos.join(', ')}`
      this.addLogEvent(titulo)
    }
    this.appService.currentPage.next('thanks')
    return update(ref(this.rtdb), updates)
  }

  reservateIndividualSeatByAdmin(
    sectionName: string,
    seat: Seat,
    familyCode: number | null,
  ) {
    if (!familyCode) return Promise.resolve()

    const updates = {} as any
    const family = familyData[familyCode]
    const familiesRef = ref(this.rtdb, 'families/' + family.familyId)
    return get(familiesRef)
      .then((snapshot: any) => {
        updates['/families/' + family.familyId + '/availableSeats'] =
          snapshot.val().availableSeats - 1
        updates['/seats/' + sectionName + '/' + seat.id + '/familyCode'] =
          snapshot.val().familyCode
        updates['/seats/' + sectionName + '/' + seat.id + '/familyId'] =
          family.familyId
        updates['/seats/' + sectionName + '/' + seat.id + '/lastName'] =
          family.lastName
        return update(ref(this.rtdb), updates)
      })
      .catch((error) => {
        return false
      })
  }

  reservateIndividualBoxByAdmin(
    sectionName: string,
    seat: Seat,
    familyCode: number | null,
  ) {
    if (!familyCode) return Promise.resolve()

    const updates = {} as any
    const family = familyData[familyCode]
    const familiesRef = ref(this.rtdb, 'families/' + family.familyId)
    return get(familiesRef)
      .then((snapshot: any) => {
        updates['/families/' + family.familyId + '/availableSeats'] =
          snapshot.val().availableSeats - 4
        updates['/seats/' + sectionName + '/' + seat.id + '/familyCode'] =
          snapshot.val().familyCode
        updates['/seats/' + sectionName + '/' + seat.id + '/familyId'] =
          family.familyId
        updates['/seats/' + sectionName + '/' + seat.id + '/lastName'] =
          family.lastName
        return update(ref(this.rtdb), updates)
      })
      .catch((error) => {
        return false
      })
  }

  freeIndividualSeatByAdmin(sectionName: string, seat: Seat) {
    const updates = {} as any
    if (seat.familyId) {
      const familiesRef = ref(this.rtdb, 'families/' + seat.familyId)
      get(familiesRef)
        .then((snapshot: any) => {
          updates['/families/' + seat.familyId + '/availableSeats'] =
            snapshot.val().availableSeats + 1
          updates['/seats/' + sectionName + '/' + seat.id + '/familyCode'] =
            null
          updates['/seats/' + sectionName + '/' + seat.id + '/familyId'] = null
          updates['/seats/' + sectionName + '/' + seat.id + '/lastName'] = null
          return update(ref(this.rtdb), updates)
        })
        .catch((error) => {
          return false
        })
    }
    return Promise.resolve()
  }

  selectSeat(seat: Seat | null, sectionName: string) {
    if (this.hasById(this.selectedSeats, seat?.id)) {
      this.removeFromSelectionDetail(sectionName, seat)
      this.deleteById(this.selectedSeats, seat?.id)
      this.availableSeats.next(this.availableSeats.value + 1)
      return false
    }
    if (
      !this.selectedSeats.has({ id: seat?.id, sectionName }) &&
      this.availableSeats.value > 0
    ) {
      this.selectedSeats.add({
        id: seat?.id,
        sectionName,
        row: seat?.row,
        seat: seat?.seat,
      })
      this.addToSelectionDetail(sectionName, seat)
      this.availableSeats.next(this.availableSeats.value - 1)
      return true
    }
    this.toasterService.showToaster(messageTicketsPerFamily)

    return false
  }

  selectBox(seat: Seat | null, sectionName: string) {
    if (this.hasById(this.selectedSeats, seat?.id)) {
      this.removeFromSelectionDetail(sectionName, seat)
      this.deleteById(this.selectedSeats, seat?.id)
      this.availableSeats.next(this.availableSeats.value + 4)
      return false
    }
    if (
      !this.selectedSeats.has({ id: seat?.id, sectionName }) &&
      this.availableSeats.value > 3
    ) {
      this.selectedSeats.add({
        id: seat?.id,
        sectionName,
        row: seat?.row,
        seat: seat?.seat,
      })
      this.addToSelectionDetail(sectionName, seat)

      this.availableSeats.next(this.availableSeats.value - 4)
      return true
    }
    this.toasterService.showToaster(messageTicketsPerFamily)
    return false
  }

  hasById(set: any, id: any) {
    for (let item of set) {
      if (item.id === id) {
        return true
      }
    }
    return false
  }

  deleteById(set: any, id: any) {
    for (let item of set) {
      if (item.id === id) {
        set.delete(item)
        return true
      }
    }
    return false
  }

  uploadAllFamilies() {
    this.http
      .get<{ lastName: string; familyCode: string }[]>('assets/output.json')
      .subscribe((dataArray) => {
        const dbRef = ref(this.rtdb, 'families')
        dataArray.forEach((item) => push(dbRef, item))
      })
  }
}
