import { Injectable } from '@angular/core'
import {
  User,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { BehaviorSubject, Observable } from 'rxjs'
import app from '../../firebase'
import { ALLOWED_ADMIN_EMAILS } from '../constants'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(app)
  private userSubject = new BehaviorSubject<User | null>(null)
  private readySubject = new BehaviorSubject(false)

  readonly user$: Observable<User | null> = this.userSubject.asObservable()
  readonly authReady$: Observable<boolean> = this.readySubject.asObservable()

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user)
      if (!this.readySubject.value) {
        this.readySubject.next(true)
      }
    })
  }

  get currentUser(): User | null {
    return this.userSubject.value
  }

  isAllowedEmail(email: string | null | undefined): boolean {
    if (!email) return false
    return (ALLOWED_ADMIN_EMAILS as readonly string[]).includes(
      email.toLowerCase(),
    )
  }

  isAdmin(): boolean {
    return this.isAllowedEmail(this.currentUser?.email)
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account', hd: 'lascumbres.edu.ar' })
    const result = await signInWithPopup(this.auth, provider)
    if (!this.isAllowedEmail(result.user.email)) {
      await signOut(this.auth)
      throw new Error(
        'Esta cuenta no tiene permiso para administrar el Concert.',
      )
    }
    return result.user
  }

  async signOut(): Promise<void> {
    await signOut(this.auth)
  }
}
