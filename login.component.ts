import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {
  Auth,
  signOut,
  signInWithPopup,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
  OAuthProvider,
  linkWithPopup,
  unlink,
  updateEmail,
  updatePassword,
  User,
  reauthenticateWithPopup,
  authState,
  onAuthStateChanged
} from '@angular/fire/auth';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
  setDoc,
} from '@angular/fire/firestore';
import { getDoc } from '@firebase/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public registerForm!: FormGroup;
  public loginSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private authService: AuthService,
    private afs: Firestore,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.initRegisterForm();
  }
  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  }
  register(): void {
    console.log(this.registerForm.value);
    const { email, password } = this.registerForm.value;
    // this.emailSignUp(email, password).then(data => {
    //   console.log(data);
    // })
    this.login(email, password)
  }
  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      orders: [],
      role: 'USER'
    }
    let data = await setDoc(doc(this.afs, "users", credential.user.uid), user);
    return data;
  }
  
  async login(email: string, password: string): Promise<any> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user));
      if(user && user.role === 'ADMIN'){
        this.router.navigate(['/admin'])
      }else if(user && user.role === 'USER'){
        this.router.navigate(['/profile'])
      }
      this.authService.currentUser$.next(true)
    }); 
  }
  ngOnDestroy(): void{
    this.loginSubscription.unsubscribe();
  }
}