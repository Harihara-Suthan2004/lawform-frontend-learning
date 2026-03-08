import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Header } from '../../Components/header/header';
import { RouterLink } from '@angular/router';
import { NoticeService } from '../../services/notice.service';


@Component({
  selector: 'app-history',
  imports: [FormsModule,MatTableModule, MatInputModule, MatFormFieldModule,MatPaginatorModule,Header,RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
  private noticeService = inject(NoticeService);
  http = inject(HttpClient);

  displayedColumns: string[] = ['ClientName', 'Date', 'NoticeTitle', 'Status'];
  dataSource = new MatTableDataSource<APIdatas>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.getData();
     this.dataSource.filterPredicate = (data: APIdatas, filter: string) => {
    return data.ClientName.toLowerCase().includes(filter);};
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  downloadDocument(item: any) {
    this.noticeService.downloadFromHistory(item.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Suggesting the filename
        link.download = `${item.NoticeTitle || 'Notice'}.pdf`;
        
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => alert("File no longer exists on the server.")
    });
  }

  getData() {
    this.noticeService.getHistory().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error("Could not fetch history", err)
    });
  }

  
  goToPage(index: number) {
    this.paginator.pageIndex = index;
    this.dataSource.paginator = this.paginator; // Refresh the data source view
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
export interface APIdatas {
  ClientName: string;
  Date: string;
  NoticeTitle: string;
  id: string;
  file_path: string;
}
