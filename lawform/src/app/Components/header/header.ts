import { Component, Input, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Profile } from '../profile/profile';

@Component({
  selector: 'app-header',
  imports: [RouterLink,Profile],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() title:string='Home'
}
