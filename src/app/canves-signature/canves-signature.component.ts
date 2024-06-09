import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntil, finalize, map, tap, switchMap, takeWhile, throttleTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-canves-signature',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './canves-signature.component.html',
  styleUrls: ['./canves-signature.component.scss']
})

export class CanvesSignatureComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input('Create') Create!: number;
  @Output() onCreate: EventEmitter<{ canvas1Data: string, canvas2Data: string }> = new EventEmitter<{ canvas1Data: string, canvas2Data: string }>()

  @ViewChild('drawingCanvas') canvasRef: ElementRef<HTMLCanvasElement> | any;
  @ViewChild('initialsCanvas') initialsCanvasRef: ElementRef<HTMLCanvasElement> | any;
  @ViewChild('colorPickerMain') colorPickerMainRef: ElementRef<HTMLCanvasElement> | any;
  @ViewChild('colorPickerIatials') colorPickerInatialsRef: ElementRef<HTMLCanvasElement> | any;
  @ViewChild('viewer') viewerRef: ElementRef<HTMLDivElement> | any;
  isDrawing = false;
  private drawingSubscription: any;
  private image: HTMLImageElement = new Image();
  lastPoint: { x: number; y: number } | null = null;
  lineWidthMainSig = 5;
  lineWidthInatialSig = 5;

  initialColor: string = 'black';

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    const drawingCanvas = this.canvasRef?.nativeElement;
    const initialsCanvas = this.initialsCanvasRef?.nativeElement;

    if (drawingCanvas) {
      const ctx = drawingCanvas.getContext('2d');
      drawingCanvas.getContext('2d').lineWidth = this.lineWidthMainSig;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'antialias';
      this.setupDrawing(ctx, 'drawing'); // Setup drawing for drawingCanvas
    } else {
      console.error('Drawing canvas element not found');
    }

    if (initialsCanvas) {
      const ctx = initialsCanvas.getContext('2d');
      initialsCanvas.getContext('2d').lineWidth = this.lineWidthInatialSig;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'antialias';
      this.setupDrawing(ctx, 'initials'); // Setup drawing for initialsCanvas
    } else {
      console.error('Initials canvas element not found');
    }
  }

  ngOnDestroy() {
    if (this.drawingSubscription) {
      this.drawingSubscription.unsubscribe();
    }
  }

  private setupDrawing(ctx: CanvasRenderingContext2D | any, canvasType: string) {
    this.drawingSubscription = fromEvent(ctx.canvas, 'mousedown')
      .pipe(
        map((event: MouseEvent | any) => ({
          x: event.offsetX,
          y: event.offsetY
        })),
        tap(() => (this.isDrawing = true)),
        switchMap((start) =>
          fromEvent(document, 'mousemove')
            .pipe(
              throttleTime(10), // Adjust for smoothness vs. performance
              map((event: MouseEvent | any) => ({
                x: event.offsetX,
                y: event.offsetY
              })),
              takeWhile(() => this.isDrawing),
              tap((point) => {
                if (this.isDrawing) {
                  ctx.lineTo(point.x, point.y);
                  ctx.stroke();
                }
              }),
              takeUntil(fromEvent(window, 'mouseup')),
              finalize(() => {
                this.isDrawing = false;
                ctx.closePath();
              })
            )
        )
      )
      .subscribe();
  }

  // private setupDrawing(ctx: CanvasRenderingContext2D, canvasType: string) {
  //   this.drawingSubscription = fromEvent(ctx.canvas, 'mousedown')
  //     .pipe(
  //       map((event: MouseEvent | any) => ({
  //         x: event.offsetX,
  //         y: event.offsetY
  //       })),
  //       tap(() => (this.isDrawing = true)),
  //       switchMap((start) =>
  //         fromEvent(document, 'mousemove')
  //           .pipe(
  //             throttleTime(10), // Adjust for performance (lower value = smoother, but slower)
  //             map((event: MouseEvent | any) => {
  //               const newPoint = {
  //                 x: event.offsetX,
  //                 y: event.offsetY
  //               };
  //               // Calculate random variations for a more natural look
  //               const variationX = Math.random() * 2 - 1; // Range: -1 to 1
  //               const variationY = Math.random() * 2 - 1;
  //               newPoint.x += variationX;
  //               newPoint.y += variationY;
  //               return newPoint;
  //             }),
  //             takeWhile(() => this.isDrawing),
  //             tap((point) => {
  //               if (this.isDrawing) {
  //                 if (!this.lastPoint) {
  //                   this.lastPoint = point; // Store starting point
  //                   ctx.beginPath();
  //                   ctx.moveTo(point.x, point.y);
  //                 } else {
  //                   // Simulate pressure sensitivity (optional)
  //                   const distance = Math.hypot(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
  //                   const lineWidth = this.lineWidthMainSig * (distance / 10) + 1; // Adjust factor for sensitivity
  //                   ctx.lineWidth = lineWidth;

  //                   ctx.lineTo(point.x, point.y);
  //                   ctx.stroke();
  //                 }
  //                 this.lastPoint = point; // Update last point for next iteration
  //               }
  //             }),
  //             takeUntil(fromEvent(window, 'mouseup')),
  //             finalize(() => {
  //               this.isDrawing = false;
  //               ctx.closePath();
  //               this.lastPoint = null; // Reset last point
  //             })
  //           )
  //       )
  //     )
  //     .subscribe();
  // }

  clearDrawingCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clear only the drawn content (not the background image)
      ctx.beginPath();
      ctx.fillStyle = 'transparent'; // Set fill style to transparent
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.closePath();
      this.ngAfterViewInit();
      // this.updateViewer(); // Update viewer after clearing
    }
  }

  clearInatialsCanvas() {
    const canvas = this.initialsCanvasRef?.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clear only the drawn content (not the background image)
      ctx.beginPath();
      ctx.fillStyle = 'transparent'; // Set fill style to transparent
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.closePath();

      this.ngAfterViewInit();
      // this.updateViewer(); // Update viewer after clearing
    }
  }


  changeColorMain(color: string | any) {
    if (this.colorPickerMainRef) {
      const ctx = this.canvasRef.nativeElement.getContext('2d');
      ctx.strokeStyle = color; // Update stroke style based on color picker
    }
  }

  changeColorInatials(color: string | any) {
    if (this.colorPickerInatialsRef) {
      const ctx = this.initialsCanvasRef.nativeElement.getContext('2d');
      ctx.strokeStyle = color; // Update stroke style based on color picker
    }
  }



  private loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = imageUrl;
    });
  }



  private updateViewer() {
    const canvas = this.canvasRef.nativeElement;
    const viewer = this.viewerRef.nativeElement;

    if (canvas && viewer) {
      const newImage = new Image(); // Create a new image element
      newImage.onload = () => {
        viewer.innerHTML = ''; // Clear existing content
        viewer.appendChild(newImage); // Append the new image
      };
      newImage.src = canvas.toDataURL(); // Set image source to canvas data URL
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Create'] && changes['Create'].currentValue === 1) {
      this.createImages();
    }
  }

  createImages() {
    const drawingCanvas = this.canvasRef?.nativeElement;
    const initialsCanvas = this.initialsCanvasRef?.nativeElement;

    const canvas1Data = drawingCanvas.toDataURL('image/png');
    const canvas2Data = initialsCanvas.toDataURL('image/png');

    this.onCreate.emit({ canvas1Data, canvas2Data });
  }
}