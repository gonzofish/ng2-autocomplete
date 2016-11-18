import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  myItems = [
    'apple',
    'tiger',
    'disc',
    'shirt',
    'storm'
  ];
  selectedItem: string = '';

  onItemSelected(item: string) {
    this.selectedItem = item;
  }
}
