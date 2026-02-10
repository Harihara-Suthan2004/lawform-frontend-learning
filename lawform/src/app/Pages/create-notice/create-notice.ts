import { Component } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-create-notice',
  imports: [Header, RouterLink],
  templateUrl: './create-notice.html',
  styleUrl: './create-notice.css',
})
export class CreateNotice {

}
