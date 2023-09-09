import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { AnalyticsService } from './app/shared/analytics.service';

if (environment.production) {
  enableProdMode();
}

// old way to bootstrap the application with a module:
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

// correct way to bootstrap an SC:
bootstrapApplication(AppComponent, {
  providers: [
    // AnalyticsService
  ]
});
