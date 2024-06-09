import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[drag-drop]'
})
export class FileDragDropDirective {
	@Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();

	@HostBinding('style.background') private background = '#f5f5f6';
	@HostBinding('style.border') private borderStyle = '2px dashed';
	@HostBinding('style.border-color') private borderColor = '#c2c3c6';
	@HostBinding('style.border-radius') private borderRadius = '5px';

	constructor() {}

	@HostListener('dragover', ['$event']) public onDragOver(evt: any) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#eee';
		this.borderColor = '#4b77be';
		this.borderStyle = '3px dashed';
	}

	@HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#f5f5f6';
		this.borderColor = '#4b77be';
		this.borderStyle = '2px dashed';
	}

	@HostListener('drop', ['$event']) public onDrop(evt: any) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#f5f5f6';
		this.borderColor = '#4b77be';
		this.borderStyle = '2px dashed';
		let files = evt.dataTransfer.files;
		let valid_files: Array<File> = files;
		this.filesChangeEmiter.emit(valid_files);
	}
}
