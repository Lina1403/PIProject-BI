import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, type: string): SafeResourceUrl | SafeHtml {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'url': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`SafePipe ne prend pas en charge le type: ${type}`);
    }
  }
}
