import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  private passwordMatch(g: FormGroup) {
    return g.get('password')?.value === g.get('confirm')?.value ? null : { mismatch: true };
  }

  async register() {
    if (this.form.invalid) return;
    const loader = await this.loading.create({ message: 'Creazione account...' });
    await loader.present();
    try {
      await this.auth.register(this.form.value.email, this.form.value.password);
      await loader.dismiss();
      this.router.navigate(['/tabs/setup']);
    } catch (e: any) {
      await loader.dismiss();
      const alert = await this.alert.create({
        header: 'Errore di registrazione',
        message: e.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
