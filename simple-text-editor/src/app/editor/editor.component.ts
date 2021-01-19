import { constants } from "./../../constants/constants";
import { debounceTime } from "rxjs/operators";
import { Component, HostListener, OnInit } from "@angular/core";
import Utils from "src/utils/utils";

@Component({
	selector: "app-editor",
	templateUrl: "./editor.component.html",
	styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnInit {
	public readonly keyCodes: { [key: string]: number } = constants.KEY_CODES;

	public showContextMenu = false;
	public textToSave: string[] = [""];
	public writtenText: string;
	public index = 0;

	private clickCounter = 0;
	private keyStrokesCount = 0;
	private elementToFocus: HTMLElement;

	constructor(private utils: Utils) {}

	ngOnInit(): void {
		this.forceFocus();
	}

	private writeOnLine(): void {
		debounceTime(1000);
		this.writtenText = document.getElementById(
			`paragraph_${this.index}`
		).textContent;
	}

	private createNewLine(): void {
		this.index = this.index + 1;
		this.textToSave.splice(this.index, 0);
		this.textToSave[this.index] = this.writtenText;
		this.writtenText = this.utils.setNullOrEmpty(this.writtenText);
	}

	public setFocusOnLine(event, isOnClick: boolean = true): void {
		const elementId: string = event.target.id;
		const substring: number = Number(
			elementId.substring(elementId.indexOf("_") + 1)
		);

		this.index = substring
			? substring
			: this.textToSave
			? this.textToSave.length - 1
			: 0;

		this.removeContentEditable();

		if (isOnClick) {
			this.elementToFocus = event.target;
		} else {
			setTimeout(() => {
				this.elementToFocus = document.getElementById(elementId);
			});
		}

		setTimeout(() => {
			if (this.elementToFocus) {
				this.elementToFocus.setAttribute("contenteditable", "true");
				this.elementToFocus.focus();
			}
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
			this.writeOnLine();
			return;
		}

		if (shouldPreventDefault) {
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
