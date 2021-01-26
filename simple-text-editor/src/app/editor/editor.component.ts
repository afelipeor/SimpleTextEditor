import { SafeHtml } from "@angular/platform-browser";
import { constants } from "./../../constants/constants";
import { debounceTime } from "rxjs/operators";
import { Component, HostListener, OnInit } from "@angular/core";
import Utils from "src/utils/utils";
import { keyframes } from "@angular/animations";

@Component({
	selector: "app-editor",
	templateUrl: "./editor.component.html",
	styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
	public showContextMenu = false;
	public index: number = 0;

	constructor(private utils: Utils) {}

	ngOnInit(): void {
		document.getElementById("editor").focus();
	}

	@HostListener("document:keypress", ["$event"])
	private handleEnter(event): void {
		const editor: HTMLElement = document.getElementById("editor");
		const innerText: string = editor.innerText;
		let textToSave: string[];

		// Split where \n
		textToSave = innerText.split("\n");
		this.saveText(textToSave);
	}

	public saveText(textToSave: string[]): void {
		console.log(`textToSave ${this.index++}`, textToSave);
	}
}
