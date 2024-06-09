import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { map, tap, switchMap, takeUntil, finalize } from 'rxjs/operators';

import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

	ngOnInit() {
		this.filterFont();


	}

	title = 'Signture-POC';

	demoInatals: string = "FN"; // Initialize demo text
	demoFullName: string = "FullName"; // Initialize demo text
	searchText: string = "";
	fonts: any[] = [
		{ name: 'Arial', selected: false },
		{ name: 'Times New Roman', selected: false },
		{ name: 'Verdana', selected: false },
		{ name: 'Cornerstone', selected: false },
		{ name: 'Coronet', selected: false },
		{ name: 'Courier', selected: false },
		{ name: 'Courier New', selected: false },
		{ name: 'Cuckoo', selected: false },
		{ name: 'Dauphin', selected: false },

	];
	filteredFonts: any[] = [];


	// Fonts Draw Upload
	activeTab: string = 'Fonts'; // Variable to track the active tab




	Tabs = {
		Fonts: 0,
		Draw: 0,
		Upload: 0
	}
	isAgreed = false; // Initial state

	updateButtonState() {
		this.isAgreed = !this.isAgreed // Update when checkbox changes
	}
	constructor() { }







	filterFont(font: string = '') {
		// debugger
		if (font) { this.filteredFonts = this.fonts.filter(x => x.name.toLowerCase().includes(font.toLowerCase())); }

		else {
			this.filteredFonts = this.fonts;



		}
	}





	async convertSelectedToPNG() {
		const selectedFonts = this.filteredFonts.filter(font => font.selected);
		console.log(selectedFonts);
		let todayDate = new Date().toISOString().toLocaleLowerCase().replace(/\D/g, '').toString();
		this.isAgreed = false;
		selectedFonts.forEach(font => {
			// Convert full name and initials to PNG images
			this.convertTextToImage(this.demoFullName, font.name + `full_name${todayDate}.png`, font.name);
			this.convertTextToImage(this.demoInatals, font.name + `initials${todayDate}.png`, font.name);
		});
	}

	saveBase64ToAssets(base64Data: string, filename: string) {
		// Extract base64 image data (remove the prefix)
		const base64Image = base64Data.split(',')[1];

		// Create a Blob from base64 data
		const byteCharacters = atob(base64Image);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: 'image/png' });

		// Save the Blob to assets
		saveAs(blob, `assets/${filename}`);
	}

	async convertTextToImage(text: string, filename: string, fontFamily: string) {
		// Create a temporary element to render text
		const tempElement = document.createElement('span');
		tempElement.style.fontFamily = fontFamily;
		tempElement.style.fontSize = '35px';
		tempElement.textContent = text;
		console.log(tempElement);

		document.body.appendChild(tempElement);
		// Use html2canvas to render text on canvas
		await html2canvas(tempElement).then(canvas => {

			document.body.removeChild(tempElement);

			canvas.toBlob(blob => {
				if (blob !== null) {
					// Convert blob to base64
					const reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onloadend = () => {
						// Save the base64 image to assets
						this.saveBase64ToAssets(reader.result as string, filename);
					};
				} else {
					console.error('Failed to convert text to image.');
				}
			}, 'image/png');

		});
		this.isAgreed = true;
	}
	async onCreate() {
		switch (this.activeTab) {
			case 'Fonts':
				this.Tabs.Fonts = 1;
				this.Tabs.Draw = 0;
				this.Tabs.Upload = 0;
				await this.convertSelectedToPNG();
				console.log('11');

				break;
			case 'Draw':
				this.Tabs.Draw = 1;
				this.Tabs.Fonts = 0;
				this.Tabs.Upload = 0;
				console.log('22');


				break;
			case 'Upload':
				this.Tabs.Upload = 1;
				this.Tabs.Draw = 0;
				this.Tabs.Fonts = 0;
				console.log('33');

				break;

			default:
				break;
		}
	}




	onCanvasCreate(imagesData: { canvas1Data: string, canvas2Data: string }) {
		const { canvas1Data, canvas2Data } = imagesData;
		let todayDate = new Date().toISOString().toLocaleLowerCase().replace(/\D/g, '').toString();

		this.downloadImage(canvas1Data, `SignatureMain${todayDate}.png`);
		this.downloadImage(canvas2Data, `SaignatureInatials${todayDate}.png`);
	}

	onUploadCreate(event: { mainImage: string, initialsImage: string }) {
		// Perform actions with the uploaded images, e.g., download or further processing
		console.log("Main image:", event.mainImage);
		console.log("Initials image:", event.initialsImage);
	}


	downloadImage(dataURL: string, filename: string) {
		const anchor = document.createElement('a');
		anchor.href = dataURL;
		anchor.download = filename;
		anchor.click();
	}
}