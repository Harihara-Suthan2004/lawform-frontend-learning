import { Component,inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../Components/header/header';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [FormsModule, Header, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
http=inject(HttpClient);
  ProjectAPI=signal<APIdatas[]>([]);

  constructor(){
    this.GetData()
  }

  GetData(){
    this.http.get("https://688b26b82a52cabb9f50597e.mockapi.io/api/LawformHome").subscribe({
      next:(result:any)=>{
        this.ProjectAPI.set(result);
      }
    })
  }

}
export interface APIdatas{
  ClientName:string,
  Date:string,
  NoticeTitle:string,
  id:string
}
