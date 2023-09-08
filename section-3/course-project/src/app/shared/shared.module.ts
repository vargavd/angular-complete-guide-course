import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.componen";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule {

}