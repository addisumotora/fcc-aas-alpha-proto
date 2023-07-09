import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLibsModule } from './shared-libs.module';
import { UswdsIconComponent } from './uswds-icon/uswds-icon.component';



@NgModule({
  imports: [SharedLibsModule, RouterModule],
  declarations: [
    UswdsIconComponent,
  ],
  exports: [
    SharedLibsModule,
    UswdsIconComponent,
  ],
})
export class SharedModule {}
