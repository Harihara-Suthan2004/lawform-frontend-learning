import { Component,inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../Components/header/header';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from "@angular/router";
import { NoticeService } from '../../services/notice.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, Header, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private noticeService = inject(NoticeService);
  http = inject(HttpClient);
  private router = inject(Router);
  ProjectAPI = signal<APIdatas[]>([]);
  totalGenerated = signal<number>(0);
  growthPercentage = signal<number>(0);

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
        this.growthPercentage.set(result.growth_percentage);
      },
      error: (err) => console.error("Home stats fetch failed", err)
    });
  }

  viewDocument(item: APIdatas) {
    if (item.id) {
        // Navigation should match: domain/app/downloaded/ID
        this.router.navigate(['/app/downloaded', item.id]);
    } else {
        alert("Document ID not found.");
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
