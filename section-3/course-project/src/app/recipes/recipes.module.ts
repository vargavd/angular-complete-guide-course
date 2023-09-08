import { NgModule } from "@angular/core";
import { RecipesComponent } from "./recipes.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "../auth/auth.guard";
import { RecipesResolverService } from "./recipes-resolver.service";
import { DropdownDirective } from "../shared/dropdown.directive";
import { SharedModule } from "../shared/shared.module";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { 
        path: 'recipes', 
        component: RecipesComponent, 
        canActivate: [AuthGuard],
        children: [
          { path: '', component: RecipeStartComponent, resolve: [RecipesResolverService] },
          { path: 'new', component: RecipeEditComponent },
          { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
          { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] },
        ] 
      },
    ]),
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class RecipesModule {
}