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
	public writtenText: string[] = ["Start typing to begin."];
	public textToSave: string[] = [""];
	public index = 0;

	private clickCounter = 0;
	private keyStrokesCount = 0;
	private elementToFocus: HTMLElement;

	constructor() {}

	ngOnInit(): void {
		this.forceFocus();
	}

	private writeOnLine(key: string): void {
		let capturedString: string = this.writtenText[this.index]
			? this.writtenText[this.index]
			: "\n";

		if (this.keyStrokesCount === 1) {
			capturedString = `${key}`;
			this.writtenText[this.index] = capturedString;
			this.forceFocus();
		} else {
			capturedString = `${capturedString}${key}`;
		}

		console.log("capturedString:", capturedString);
		this.textToSave[this.index] = capturedString;
	}

	private createNewLine(): void {
		this.index = this.index + 1;
		this.writtenText.splice(this.index, 0);
		this.writtenText[this.index] = this.textToSave[this.index];
		console.log("this.writtenText:", this.writtenText);
	}

	public setFocusOnLine(event, isOnClick: boolean = true): void {
		const elementId: string = event.target.id;
		const substring: number = Number(
			elementId.substring(elementId.indexOf("_") + 1)
		);

		this.index = substring ? substring : this.writtenText.length - 1;

		console.log("this.index:", this.index);
		console.log("elementId:", elementId);
		this.removeContentEditable();

		if (isOnClick) {
			this.elementToFocus = event.target;
		} else {
			setTimeout(() => {
				this.elementToFocus = document.getElementById(elementId);
				console.log("this.elementToFocus:", this.elementToFocus);
			});
		}

		setTimeout(() => {
			this.elementToFocus.setAttribute("contenteditable", "true");
			this.elementToFocus.focus();
		});

		this.getSelection();
	}

	public getSelection(): void {
		this.clickCounter = this.clickCounter + 1;

		this.clickCounter = 0;
		const selection: any = window.getSelection();
		const selectionText: string = selection.toString();
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

	public captureInput(event): void {
		console.log("event.which:", event.which);
		const isControlCharacter: boolean =
			event.which <= this.keyCodes.ControlCharacterMax;
		const isDelete: boolean = event.which === this.keyCodes.Delete;
		const isFunctionKey: boolean =
			event.which >= this.keyCodes.FunctionKeyStart &&
			event.which <= this.keyCodes.FunctionKeyEnd;
		const isArrowKey: boolean =
			event.which >= this.keyCodes.ArrowKeyLeft &&
			event.which <= this.keyCodes.ArrowKeyDown;
		const isNumLock: boolean = event.which === this.keyCodes.NumLock;
		const isContextMenu: boolean =
			event.which === this.keyCodes.ContextMenu;
		const isPageUp: boolean = event.which === this.keyCodes.PageUp;
		const isPageDown: boolean = event.which === this.keyCodes.PageDown;
		const isHome: boolean = event.which === this.keyCodes.Home;
		const isEnd: boolean = event.which === this.keyCodes.End;
		const isInsert: boolean = event.which === this.keyCodes.Insert;
		const isEnter: boolean = event.which === this.keyCodes.Enter;

		const shouldIgnore: boolean =
			(isControlCharacter && isEnter) ||
			isDelete ||
			isFunctionKey ||
			isNumLock ||
			isContextMenu ||
			isPageUp ||
			isPageDown ||
			isHome ||
			isEnd ||
			isInsert;

		const shouldPreventDefault: boolean = isArrowKey || isEnter;

		this.keyStrokesCount = this.keyStrokesCount + 1;

		if (!shouldPreventDefault && !shouldIgnore) {
			this.writeOnLine(event.key);
			return;
		}

		if (shouldPreventDefault) {
			console.log("shouldPreventDefault:", shouldPreventDefault);
			event.preventDefault();
		}

		if (isArrowKey) {
			this.setArrowKeysFunction(event.which);
		}

		if (event.which === this.keyCodes.Enter) {
			this.setEnterFunction();
		}

		return;
	}

	private setArrowKeysFunction(key: number): void {
		switch (key) {
			case this.keyCodes.ArrowKeyLeft:
				break;
			case this.keyCodes.ArrowKeyUp:
				this.jumpLines(key);
				break;
			case this.keyCodes.ArrowKeyRight:
				break;
			case this.keyCodes.ArrowKeyDown:
				this.jumpLines(key);
				break;
		}
	}

	private jumpLines(key: number): void {}

	private setEnterFunction(): void {
		this.createNewLine();
		this.forceFocus();
	}

	private forceFocus(): void {
		const simulatedEventObject = {
			target: { id: `paragraph_${this.index}` },
		};
		this.setFocusOnLine(simulatedEventObject, false);
	}

	@HostListener("document: contextmenu", ["$event"])
	private toggleContextMenu(event): void {
		event.preventDefault();
		this.showContextMenu = !this.showContextMenu;
	}

	@HostListener("document: dblclick", ["$event"])
	private openContextMenu($event): void {
		this.showContextMenu = true;
	}

	@HostListener("document: click", ["$event"])
	private closeContextMenu($event): void {
		this.showContextMenu = false;
	}
}
