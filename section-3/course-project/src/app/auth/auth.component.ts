import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";

import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective; // this is a reference to the place in the DOM where we want to render the component (see below)

  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return; // do nothing
    }

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {  
      authObs = this.authService.signup(email, password);   
    }

    authObs.subscribe(
      response => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      }, errorMessage => {
        this.error = errorMessage;
        
        this.showErrorAlert(errorMessage);

        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    // const alertComponent = new AlertComponent(); // this won't work

    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    // this is a reference to the place in the DOM where we want to render the component
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear(); // clear anything that might be rendered there already

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory); // create the component

    // now we have a reference to the component we just created
    componentRef.instance.message = message; // set the message property of the component to the message we want to display in the alert
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe(); // unsubscribe from the close event so we don't have a memory leak
      hostViewContainerRef.clear(); // clear the alert from the DOM
    });
  }
}