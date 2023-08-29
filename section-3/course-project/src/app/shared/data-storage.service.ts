import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor (
    private http: HttpClient,
    private recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://angular-tcg---course-project-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://angular-tcg---course-project-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
      .pipe(map(recipes => { // map() is an rxjs operator
        return recipes.map(recipe => { // map() is a javascript array method
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }));
  }
}