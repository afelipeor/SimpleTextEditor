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

	public sanitizeHTML(htmlString: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(htmlString);
	}

	public setNullOrEmpty(variableToSet: any): any {
		const setNull: boolean = typeof variableToSet !== "string";
		return setNull ? null : "";
	}

	public isEmptyArrayOrNull(array: any[]): boolean {
		return array === null || array.length === 0;
	}
}
