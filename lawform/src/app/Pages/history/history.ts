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


@Component({
  selector: 'app-history',
  imports: [FormsModule,MatTableModule, MatInputModule, MatFormFieldModule,MatPaginatorModule,Header],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
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

  getData() {
    this.http
      .get<APIdatas[]>('https://688b26b82a52cabb9f50597e.mockapi.io/api/LawformHome')
      .subscribe(data => {
        this.dataSource.data = data;
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
}
