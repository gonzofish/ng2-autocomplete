import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'my-autocomplete',
  templateUrl: './my-autocomplete.component.html',
  styleUrls: ['./my-autocomplete.component.css']
})
export class MyAutocompleteComponent implements OnInit {
  @Input() items: Array<string>;
  @Output() selected = new EventEmitter();

  @ViewChild('itemList') private itemList: ElementRef;
  @ViewChild('textInput') private textInput: ElementRef;

  private hasFocus: boolean = false;

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

  @HostListener('document:click', ['$event'])
  onDocumentClick($event: MouseEvent) {
    let current: any = $event.target;

    while (!this.checkIsInside(current) && current !== document) {
      current = current.parentNode;
    }

    if (!this.checkIsInside(current)) {
      this.hasFocus = false;
      this.hideList(true);
    }
  }

  private checkIsInside(node: any) {
    return node === this.textInput.nativeElement ||
      node === this.itemList.nativeElement;
  }

  onSelectItem($event: MouseEvent, item: string) {
    $event.stopImmediatePropagation();
    this.selectItem(item);
  }

  navigateByKey($event: KeyboardEvent) {
    this.hide = false;

    if ($event.key === 'ArrowDown' || $event.key === 'Down' || $event.keyCode === 40) {
      this.highlightNextItem();
    } else if ($event.key === 'ArrowUp' || $event.key === 'Up' || $event.keyCode === 38) {
      this.highlightPreviousItem();
    } else if ($event.key === 'Enter' || $event.keyCode === 13) {
      this.selectHighlightedItem();
    } else {
      this.hideList($event.key === 'Escape' || $event.key === 'Esc' || $event.keyCode === 27);
    }
  }

  private highlightNextItem() {
    let index = this.highlighted + 1;

    if (index > this.list.length - 1) {
      index = 0;
    }

    this.onHighlightItem(index);
  }

  private highlightPreviousItem() {
    let index = this.highlighted - 1;

    if (index < 0) {
      index = this.list.length - 1;
    }

    this.onHighlightItem(index);
  }

  onHighlightItem(index: number) {
    this.highlighted = index;
  }

  private selectHighlightedItem() {
    this.selectItem(this.items[this.highlighted]);
  }

  selectItem(item: string) {
    this.autocompleteForm.controls['search'].setValue(item);
    this.selected.emit(item);
    this.hideList(true);
  }

  onInputFocused($event: Event) {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.hideList(false);
    }
  }

  hideList(hide: boolean) {
    this.hide = hide;
  }
}
