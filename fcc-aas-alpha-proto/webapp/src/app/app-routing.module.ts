import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './layouts/landing-page/landing-page.component';
import { NotAuthorizedComponent } from './layouts/not-authorized/not-authorized.component';
import { PageNotFoundComponent } from './layouts/page-not-found/page-not-found.component';
import { SummaryComponent } from './layouts/certify-submit/certify-submit/summary.component';
import { CSPageComponent } from './layouts/certify-submit/c-s-page/c-s-page.component';
import { ConformationOfSubmissionComponent } from './layouts/certify-submit/conformation-of-submission/conformation-of-submission.component';
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: '', component: LandingPageComponent, title: 'FCC - Landing Page' },
        { path: 'certify', component: SummaryComponent, title: 'certify and submit' },
        { path: 'cs-page', component: CSPageComponent, title: 'cs-page' },
        { path: 'conformation', component: ConformationOfSubmissionComponent, title: 'cs-page' },
        { path: '404', pathMatch: 'full', component: PageNotFoundComponent, title: 'FCC - Page Not Found' },
        { path: '403', component: NotAuthorizedComponent, title: 'FCC - Unauthorized' },
        { path: '**', pathMatch: 'full', component: PageNotFoundComponent, title: 'FCC - Landing Page' },
      ],
      { onSameUrlNavigation: 'reload' }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
