import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-btn',
  imports: [MatButtonModule,MatIconModule, RouterLink ],
  templateUrl: './add-btn.html',
  styleUrl: './add-btn.css',
})
export class AddBtn {

}
