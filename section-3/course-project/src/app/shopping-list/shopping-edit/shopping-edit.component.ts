import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  
  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);

        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;

    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, new Ingredient(value.name, value.amount));
    } else {
      this.slService.addIngredient(new Ingredient(value.name, value.amount));
    }

    form.reset();

    this.editMode = false;
    this.editedItemIndex = null;
  }
  
  onClear() {
    this.slForm.reset();

    this.editMode = false;
    this.editedItemIndex = null;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);

    this.onClear();
  }
}
