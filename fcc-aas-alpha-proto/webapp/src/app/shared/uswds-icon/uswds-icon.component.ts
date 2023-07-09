import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'aas-uswds-icon',
  templateUrl: './uswds-icon.component.html',
  styleUrls: ['./uswds-icon.component.scss'],
})
export class UswdsIconComponent implements OnInit {
  @Input() size = 3;
  @Input() iconType = '';
  @Input() color = '';
  @Input() height = '';
  @Input() width = '';
  cssSize = 'usa-icon--size-';
  xlinkPath = '';

  ngOnInit(): void {
    if (this.size < 2) {
      this.size = 2;
    } else if (this.size > 9) {
      this.size = 9;
    }

    this.cssSize += this.size;
    this.xlinkPath += this.iconType;
  }
}
