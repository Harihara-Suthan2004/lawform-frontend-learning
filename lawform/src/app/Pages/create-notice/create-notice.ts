import { Component } from '@angular/core';
import { Header } from '../../Components/header/header';
import { RouterLink } from "@angular/router";
import { LegalNotice } from '../../Components/legal-notice/legal-notice';

@Component({
  selector: 'app-create-notice',
  imports: [Header, RouterLink,LegalNotice],
  templateUrl: './create-notice.html',
  styleUrl: './create-notice.css',
})
export class CreateNotice {

}
