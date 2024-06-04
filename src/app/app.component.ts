import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // BrowserModule,
    // BrowserAnimationsModule,
    FormsModule,
    // MatTabsModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatSelectModule,
    // MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Signture-POC';

  demoText: string = 'Test'; // Initialize demo text
  fonts: any[] = [
    { name: 'Arial' },
    { name: 'Times New Roman' },
    { name: 'Verdana' },
  ]; // Array to hold fonts data
  finalView: string = ''; // Variable to hold final view of drawing
  imageUrl: string | ArrayBuffer | null = ''; // Variable to hold uploaded image URL

  constructor() {}

  // Function to handle file change event for image upload
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.size <= 12000000) {
        // Check file size
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageUrl = reader.result;
        };
      } else {
        console.log('File size exceeds 12MB limit.');
      }
    }
  }
}
