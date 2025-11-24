import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Search } from '../search/search';

@Component({
  selector: 'app-header',
  standalone:true,
  imports:[CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, Search],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 @Input() toggleSidebar !: () => void; 
 showSearch=signal<boolean>(false);
 toogelShowSearch(){
  this.showSearch.update(v=> !v)
 }

} 