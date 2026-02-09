import { Component,inject} from '@angular/core';
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
  selector: 'app-users',
  imports: [FormsModule,MatTableModule, MatInputModule, MatFormFieldModule,MatPaginatorModule,Header],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
   http = inject(HttpClient);

  displayedColumns: string[] = ['UserName', 'CreatedAt', 'Email', 'isActive','Action'];
  dataSource = new MatTableDataSource<APIdatas>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.getData();
     this.dataSource.filterPredicate = (data: APIdatas, filter: string) => {
    return data.UserName.toLowerCase().includes(filter);};
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getData() {
    this.http
      .get<APIdatas[]>('https://api.mockfly.dev/mocks/0874be77-6650-4249-9e89-dc9ac80a89cd/user')
      .subscribe(data => {
        this.dataSource.data = data;
        if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      });
  }
  goToPage(index: number) {
    this.paginator.pageIndex = index;
    this.dataSource.paginator = this.paginator; 
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
UserName: string;
  CreatedAt: string; 
  Email: string;    
  isActive: boolean;
  id: string;
}
