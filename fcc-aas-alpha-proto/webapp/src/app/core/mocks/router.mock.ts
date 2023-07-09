import { NavigationEnd } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';

export class MockRouter {
  url = 'test';
  snapshot: any = {
    root: {
      firstChild: {
        data: { showCompanyDropdown: true },
      },
    },
  };
  routerState: any = { snapshot: this.snapshot };
  events: Observable<any> | Subject<any> = of(new NavigationEnd(0, 'https://test', 'https://test'));
  config: any[] = [
    {
      data: {
        topLevelNav: true,
        pageTitle: 'test',
        authorities: [''],
        requiredFeatureFlag: 'test',
      },
    },
    { data: {} },
    { notData: {} },
  ];
  navigate(): jest.Mock<any> {
    return jest.fn();
  }
  navigateByUrl(): jest.Mock<any> {
    return jest.fn();
  }
}