import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-copy-wrapper',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './copy-wrapper.html',
  styleUrl: './copy-wrapper.css',
})
export class CopyWrapper {
  @Input() tooltipMessage: string = 'copy to clipboard';
  copy(element: HTMLElement, tooltip: MatTooltip) {
    navigator.clipboard.writeText(element.innerText);
    tooltip.message = 'Copied!';
    tooltip.show();
  }
}
