import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from './modules/angular-material.module';
import { CurrentSchedulesApiService } from './services/api/current-schedules-api.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { DialogScheduleComponent } from './components/schedules/dialog-schedule/dialog-schedule.component';
import { CurrentScheduleViewerComponent } from './components/current-schedules/current-schedule-viewer/current-schedule-viewer.component';
import { SchedulesListComponent } from './components/schedules/schedules-list/schedules-list.component';
import { SnackbarMessageComponent } from './components/snackbar-message/snackbar-message.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DialogScheduleComponent,
    CurrentScheduleViewerComponent,
    SchedulesListComponent,
    SnackbarMessageComponent,
    SafeHtmlPipe,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
  ],
  providers: [CurrentSchedulesApiService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
