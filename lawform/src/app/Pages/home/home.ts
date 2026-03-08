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
  http = inject(HttpClient);
  ProjectAPI = signal<APIdatas[]>([]);
  totalGenerated = signal<number>(0);

  constructor(){
    this.GetData()
  }

  GetData() {
    const token = localStorage.getItem('auth_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    // Point to your actual FastAPI backend
    this.http.get<any>("http://localhost:8000/api/dashboard-stats", { headers }).subscribe({
      next: (result) => {
        this.ProjectAPI.set(result.recent_documents);
        this.totalGenerated.set(result.total_generated);
      },
      error: (err) => console.error("Home stats fetch failed", err)
    });
  }

  viewDocument(filePath: string) {
    if (filePath) {
        // If it's a full URL or a relative path served by your FastAPI
        const fullUrl = `http://localhost:8000/${filePath}`;
        window.open(fullUrl, '_blank');
    } else {
        alert("Document path not found.");
    }
}
}
export interface APIdatas{
  ClientName:string,
  Date:string,
  NoticeTitle:string,
  id:string,
  file_path:string;
}
