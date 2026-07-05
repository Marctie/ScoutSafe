import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loading: LoadingController,
    private alert: AlertController
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    if (this.form.invalid) return;
    const loader = await this.loading.create({ message: 'Accesso in corso...' });
    await loader.present();
    try {
      await this.auth.login(this.form.value.email, this.form.value.password);
      await loader.dismiss();
      this.router.navigate(['/tabs/setup']);
    } catch (e: any) {
      await loader.dismiss();
      const alert = await this.alert.create({
        header: 'Errore di accesso',
        message: this.friendlyError(e.code),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  private friendlyError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found': 'Nessun account trovato con questa email.',
      'auth/wrong-password': 'Password errata.',
      'auth/invalid-email': 'Email non valida.',
      'auth/too-many-requests': 'Troppi tentativi. Riprova tra qualche minuto.'
    };
    return map[code] ?? 'Errore durante l\'accesso. Riprova.';
  }
}
