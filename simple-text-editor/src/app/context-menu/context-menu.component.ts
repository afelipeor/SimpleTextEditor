import { SafeHtml } from "../../../node_modules/@angular/platform-browser";
import icons from "./../../assets/icons/icons";
import { Component, OnInit } from "../../../node_modules/@angular/core";
import Utils from "../../utils/utils";

@Component({
	selector: "app-context-menu",
	templateUrl: "./context-menu.component.html",
	styleUrls: ["./context-menu.component.scss"],
})
export class ContextMenuComponent implements OnInit {
	public readonly icons: {
		[key: string]: SafeHtml;
	} = this.generateIconObject();
	public readonly iconList: SafeHtml[] = Object.values(this.icons).map(
		(value) => value
	);

	constructor(private utils: Utils) {}

	ngOnInit(): void {
		console.log("icons", this.icons);
		console.log("iconList:", this.iconList);
	}

	private generateIconObject(): { [key: string]: SafeHtml } {
		const iconObject: { [key: string]: SafeHtml } = {};
		for (const icon of Object.keys(icons.CONTEXT_MENU)) {
			iconObject[icon] = this.makeSvgCodeSafe(icons.CONTEXT_MENU[icon]);
		}
		return iconObject;
	}

	private makeSvgCodeSafe(svg): SafeHtml {
		return this.utils.makeSvgCodeSafe(svg);
	}
}
