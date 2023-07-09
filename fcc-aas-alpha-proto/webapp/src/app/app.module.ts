import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './layouts/landing-page/landing-page.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { GovBannerComponent } from './layouts/gov-banner/gov-banner.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './core/auth/auth-guard.service';
import { HttpInterceptorProviders } from './core/interceptors/interceptor-provider';
import { AuthService } from './core/auth/auth.service';
import { SharedModule } from './shared/shared.module';
import { SummaryComponent } from './layouts/certify-submit/certify-submit/summary.component';
import { CSPageComponent } from './layouts/certify-submit/c-s-page/c-s-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    NavbarComponent,
    GovBannerComponent,
    FooterComponent,
    SummaryComponent,
    CSPageComponent,
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule, 
    SharedModule,
    ],
  bootstrap: [AppComponent],
  providers: [AuthService, AuthGuard, HttpInterceptorProviders],
})
export class AppModule {}