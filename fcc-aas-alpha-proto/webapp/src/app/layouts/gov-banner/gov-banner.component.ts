import { Component, AfterViewInit } from '@angular/core';
import * as USWDS from '@uswds';
const { accordion } = USWDS;

@Component({
  selector: 'aas-gov-banner',
  templateUrl: './gov-banner.component.html',
  styleUrls: ['./gov-banner.component.scss']
})
export class GovBannerComponent implements AfterViewInit{
  id = 'gov-banner';

  ngAfterViewInit(): void {
    accordion.init();
  }
}
