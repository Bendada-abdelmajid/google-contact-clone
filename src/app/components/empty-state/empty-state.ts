import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-empty-state',
  imports: [MatButton, MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {

}
