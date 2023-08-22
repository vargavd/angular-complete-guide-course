import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      'https://cdn.pixabay.com/photo/2018/03/31/19/29/schnitzel-3279045_960_720.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]
    ),
    new Recipe(
      'Big Fat Burger',
      'What else you need to say?',
      'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1),
        new Ingredient('Cheese', 1),
        new Ingredient('Lettuce', 1),
        new Ingredient('Tomato', 1),
        new Ingredient('Onion', 1)
      ]
    )
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    // slice() returns a copy of the array, not the original array
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }
}