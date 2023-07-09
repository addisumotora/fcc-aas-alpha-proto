import { Component, HostListener, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'aas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'FCC AAS';
  minHeight = '0px';
  private onDestroy$ = new Subject<void>();


  constructor(private authService: AuthService) {
    this.authService.identity().pipe(takeUntil(this.onDestroy$)).subscribe();
    this.onScreenResize();
  }

  @HostListener('window:resize', ['$event'])
  onScreenResize(): void {
    // ensure footer is at bottom of viewport
    this.minHeight = `${window.innerHeight - 142}px`;
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
