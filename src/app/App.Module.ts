import { NgModule, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanvesSignatureComponent } from './canves-signature/canves-signature.component';
import { UploadFileComponent } from './upload-file/upload-file.component';



@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule.forRoot(routes),
		HttpClientModule,
		FormsModule,
		CanvesSignatureComponent,
		UploadFileComponent
	],
	bootstrap: [AppComponent],
	providers: []
})
export class AppModule { }