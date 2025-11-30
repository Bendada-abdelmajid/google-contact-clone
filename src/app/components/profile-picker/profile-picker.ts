import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PexelsService } from '../../services/pexels';

@Component({
  selector: 'app-profile-picker',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './profile-picker.html',
  styleUrl: './profile-picker.css',
})
export class ProfilePicker {
  @Output() avatarChange = new EventEmitter<string>();
  @Input() selectedAvatar: string | undefined = undefined;
  @Input() name: string | null = null;
  defaultAvatar =
    '/profile-placeholder.png';
  avatars = signal<any[]>([]);
  showMenu = signal<boolean>(false);
  showMore = signal<boolean>(false);
  constructor(private pexels: PexelsService) {
    this.pexels.getAvatars('illustrations').subscribe((res: any) => {
      this.avatars.set(res.photos.slice(0, 9));
    });
  }

  toogleMenu(v: boolean) {
    this.showMenu.set(v);
  }
  toogleShowMore(v: boolean) {
    this.showMore.set(v);
  }

  chooseAvatar(avatar: string) {
    this.avatarChange.emit(avatar);
    this.showMenu.set(false);
  }
  stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  }
}
