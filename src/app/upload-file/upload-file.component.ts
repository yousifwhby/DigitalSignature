import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileDragDropDirective } from '@App/Common/Directives/DragDrop.Directive';


@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [CommonModule, FormsModule, FileDragDropDirective],
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @Input('Create') Create!: number;
  @Output() onImagesCreated: EventEmitter<{ mainImage: string, initialsImage: string }> = new EventEmitter<{ mainImage: string, initialsImage: string }>();


  imageMainUrl: string | ArrayBuffer | null = ""; // Variable to hold uploaded image URL
  imageInatailsUrl: string | ArrayBuffer | null = ""; // Variable to hold uploaded image URL


  constructor(private http: HttpClient) { }

  // Function to handle file change event for image upload
  onFileChangeMain(event: any) {
    debugger
    const reader = new FileReader();
    if (event && event.length) {
      const file = event[0];
      if (file.size <= 12000000 && file.type === 'image/png') { // Check file size
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageMainUrl = reader.result;
        };
      } else {
        console.log("File size exceeds 12MB limit or the Image format is not PNG.");

      }
    }
  }

  onFileChangeInatials(event: any) {
    debugger
    const reader = new FileReader();
    if (event && event.length) {
      const file = event[0];
      if (file.size <= 12000000 && file.type === 'image/png') { // Check file size
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageInatailsUrl = reader.result;
        };
      } else {
        console.log("File size exceeds 12MB limit or the Image format is not PNG.");
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Create'] && changes['Create'].currentValue === 1) {
      if (this.imageMainUrl && this.imageInatailsUrl) {
        this.emitImagesCreatedEvent();
      } else {
        console.error("Please upload both main and initials images.");
      }
    }
  }


  emitImagesCreatedEvent() {
    this.onImagesCreated.emit({ mainImage: this.imageMainUrl as string, initialsImage: this.imageInatailsUrl as string });
  }
}