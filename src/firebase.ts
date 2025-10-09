// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDWPJbiV3wie8AfP7pIFALuw3HcZyMFdKk',
  authDomain: 'tickets-concert.firebaseapp.com',
  databaseURL: 'https://tickets-concert-default-rtdb.firebaseio.com',
  projectId: 'tickets-concert',
  storageBucket: 'tickets-concert.firebasestorage.app',
  messagingSenderId: '258820628522',
  appId: '1:258820628522:web:b434578cbb46654e93e353',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export default app
