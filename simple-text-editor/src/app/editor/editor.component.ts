import { Component, HostListener, OnInit } from "@angular/core";
import Utils from "src/utils/utils";

@Component({
	selector: "app-editor",
	templateUrl: "./editor.component.html",
	styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
	public showContextMenu = false;
	public index = 0;

	constructor(private utils: Utils) {}

	ngOnInit(): void {
		document.getElementById("editor").focus();
	}

	@HostListener("document:keypress", ["$event"])
	private handleEnter(event): void {
		const editor: HTMLElement = document.getElementById("editor");
		const innerText: string = editor.innerText;
		let processedTextArray: string[];

		// Split where \n
		processedTextArray = innerText.split("\n");
		this.replaceDivs(processedTextArray);
		this.saveText(processedTextArray);
	}

	public replaceDivs(processedTextArray: string[]): void {
		const editor: HTMLElement = document.getElementById("editor");
		const paragraphElements: string[] = [];
		for (let i = 0; i < processedTextArray.length; i++) {
			paragraphElements[
				i
			] = `<p id="paragraph_${this.index}"> ${processedTextArray[i]}</p>`;
		}
		console.log("paragraphElements:", paragraphElements);
	}

	public saveText(textToSave: string[]): void {
		console.log(`textToSave ${this.index++}`, textToSave);
	}
}
