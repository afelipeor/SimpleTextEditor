import { SafeHtml } from "@angular/platform-browser";
import icons from "./../../assets/icons/icons";
import { Component, OnInit, Sanitizer } from "@angular/core";
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

	constructor(private utils: Utils) {}

	ngOnInit(): void {}

	private generateIconObject(): { [key: string]: SafeHtml } {
		const iconObject: { [key: string]: SafeHtml } = {};
		for (const icon of Object.keys(icons)) {
			iconObject[icon] = this.makeSvgCodeSafe(icons[icon]);
		}
		console.log("iconObject:", iconObject);
		return iconObject;
	}

	private makeSvgCodeSafe(svg): SafeHtml {
		return this.utils.makeSvgCodeSafe(svg);
	}
}
