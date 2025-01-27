import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IMenu } from '../../../interfaces/menu.interface';
import { RouterLink } from '@angular/router';
import { MenuTableComponent } from './menu-table/menu-table.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink, MenuTableComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent{
  menus = new BehaviorSubject<IMenu[]>([]);

  constructor() {}
  
}
