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
	}

	public setFocusOnLine(event, isOnClick: boolean = true): void {
		let elementToFocus: HTMLElement;
		const elementId: string = event.target.id;
		const substring: number = Number(
			elementId.substring(elementId.indexOf("_") + 1)
		);

		this.index = substring ? substring : this.writtenText.length - 1;

		this.removeContentEditable();

		if (isOnClick) {
			elementToFocus = event.target;
		} else {
			setTimeout(() => {
				elementToFocus = document.getElementById(elementId);
			});
		}

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
		const isEnter: boolean = event.which !== this.keyCodes.Enter;

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

		if (!shouldPreventDefault && !shouldIgnore) {
			this.writeOnLine(event.key);
			return;
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
		const simulatedEventObject = {
			target: { id: `paragraph_${this.index}` },
		};
		this.setFocusOnLine(simulatedEventObject, false);
		this.writeOnLine("");
	}

	@HostListener("document: contextmenu", ["$event"])
	public toggleContextMenu(event): void {
		event.preventDefault();
		this.showContextMenu = !this.showContextMenu;
	}
}
