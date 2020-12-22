import { constants } from "./../../constants/constants";
import { Component, HostListener, OnInit } from "@angular/core";

@Component({
	selector: "app-editor",
	templateUrl: "./editor.component.html",
	styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
	public readonly keyCodes: { [key: string]: number } = constants.KEY_CODES;

	public showContextMenu = false;
	public writtenText: string[] = ["Start typing here"];
	public index: number;

	private clickCounter = 0;

	constructor() {}

	ngOnInit(): void {}

	private writeOnLine(key: string): void {
		let capturedString: string = this.writtenText[this.index]
			? this.writtenText[this.index]
			: "\n";

		capturedString = `${capturedString}${key}`;

		this.writtenText[this.index] = capturedString;
	}

	private createNewLine(): void {
		this.index = this.index + 1;
		this.writtenText.splice(this.index, 0);
		console.log("this.writtenText:", this.writtenText);
	}

	@HostListener("document:mousedown", ["$event"])
	public setFocusOnLine(event): void {
		const elementClass: string = event.target.className;
		this.index = Number(
			elementClass.substring(elementClass.indexOf("_") + 1)
		);
		this.removeContentEditable();
		const elementToFocus: HTMLElement = event.target;
		setTimeout(() => {
			elementToFocus.setAttribute("contenteditable", "true");
			elementToFocus.focus();
		});
		this.getSelection(event, elementToFocus);
	}

	public getSelection(event, elementToFocus: HTMLElement): void {
		this.clickCounter = this.clickCounter + 1;

		if (this.clickCounter % 2 !== 0) {
			return;
		}

		this.clickCounter = 0;
		const selection: any = window.getSelection();
		const selectionText: string = selection.toString();

		if (selectionText !== constants.IS_EMPTY_STRING) {
			this.showContextMenu = true;
		}
	}

	public removeContentEditable(): void {
		const elementToClearAttribute: NodeListOf<Element> = document.querySelectorAll(
			"[contenteditable=true]"
		);
		const elementIndex: number =
			elementToClearAttribute.length > 0
				? elementToClearAttribute.length - 1
				: 0;

		if (elementIndex > 0) {
			setTimeout(() => {
				document
					.getElementById(elementToClearAttribute[elementIndex].id)
					.removeAttribute("contenteditable");
			});
		}
	}

	@HostListener("window:keydown", ["$event"])
	public captureInput(event): void {
		const isControlCharacter: boolean =
			event.which <= this.keyCodes.ControlCharacterMax;
		const isDelete: boolean = event.which === this.keyCodes.Delete;
		const isFunctionKey: boolean =
			event.which >= this.keyCodes.FunctionKeyStart &&
			event.which <= this.keyCodes.FunctionKeyEnd;
		const isNumLock: boolean = event.which === this.keyCodes.NumLock;
		const isContextMenu: boolean =
			event.which === this.keyCodes.ContextMenu;
		const isPageUp: boolean = event.which === this.keyCodes.PageUp;
		const isPageDown: boolean = event.which === this.keyCodes.PageDown;
		const isHome: boolean = event.which === this.keyCodes.Home;
		const isEnd: boolean = event.which === this.keyCodes.End;
		const isInsert: boolean = event.which === this.keyCodes.Insert;

		const shouldIgnore: boolean =
			(isControlCharacter && event.which !== this.keyCodes.Enter) ||
			isDelete ||
			isFunctionKey ||
			isNumLock ||
			isContextMenu ||
			isPageUp ||
			isPageDown ||
			isHome ||
			isEnd ||
			isInsert;

		if (shouldIgnore) {
			return;
		}
		if (event.which === this.keyCodes.Enter) {
			event.preventDefault();
			this.createNewLine();
			this.writeOnLine("");
			return;
		}
		this.writeOnLine(event.key);
	}

	@HostListener("document: contextmenu", ["$event"])
	public toggleContextMenu(event): void {
		event.preventDefault();
		this.showContextMenu = !this.showContextMenu;
	}
}
