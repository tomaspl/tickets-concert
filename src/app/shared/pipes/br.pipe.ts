import { Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({ name: 'br', standalone: true })
export class BrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return ''
    // Replace literal <br> tags and any newline characters with a canonical <br/>
    const html = (value as string)
      .replace(/<br\s*\/?>(?=>)?/gi, '<br/>')
      .replace(/\r\n|\r|\n/g, '<br/>')
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
