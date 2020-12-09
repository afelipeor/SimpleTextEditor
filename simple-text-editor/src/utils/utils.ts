import { Injectable } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Injectable({
	providedIn: "root",
})
export default class Utils {
	constructor(private sanitizer: DomSanitizer) {}

	public makeSvgCodeSafe(svgString: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(svgString);
	}
}
