import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

@Component({
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
  selector: 'my-autocomplete',
  templateUrl: './my-autocomplete.component.html',
  styleUrls: ['./my-autocomplete.component.css']
})
export class MyAutocompleteComponent implements OnInit {
  @Input() items: Array<string>;
  @Output('selected') selectEmitter = new EventEmitter();

  @ViewChild('itemList') private itemList: ElementRef;
  @ViewChild('textInput') private textInput: ElementRef;

  autocompleteForm: FormGroup;
  hide: boolean = true;
  highlighted: number = -1;
  list: Array<String>;

  constructor() { }

  ngOnInit() {
    this.setupForm();
    this.updateList('');
  }

  private setupForm() {
    const control = new FormControl('');

    control.valueChanges.debounceTime(300)
      .subscribe((data) => this.updateList(data));
    this.autocompleteForm = new FormGroup({
      search: control
    });
  }

  private updateList(searchValue: string) {
    searchValue = searchValue.toLowerCase();
    this.list = this.items.reduce((list, item) => {
      if (item.toLowerCase().indexOf(searchValue) !== -1) {
        list.push(item);
      }

      return list;
    }, []);
  }

  onDocumentClick($event: MouseEvent) {
    let current: any = $event.target;

    while (!this.checkIsInside(current) && current !== document) {
      current = current.parentNode;
    }

    this.hideList(!this.checkIsInside(current));
  }

  private checkIsInside(node: any) {
    return node === this.textInput.nativeElement ||
      node === this.itemList.nativeElement;
  }

  onSelectItem($event: MouseEvent, item: string) {
    $event.stopImmediatePropagation();
    this.selectItem(item);
  }

  selectItem(item: string) {
    this.selectEmitter.emit(item);
    this.hideList(true);
  }

  hideList(hide: boolean) {
    this.hide = hide;
  }
}
