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
import { CommonModule } from '@angular/common';
import { AddUser } from '../../Components/add-user/add-user'; // Import the new component

@Component({
  selector: 'app-users',
  imports: [
    FormsModule, 
    MatTableModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatPaginatorModule, 
    Header, 
    RouterLink, 
    CommonModule,
    AddUser // Add the new component here
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  http = inject(HttpClient);

  displayedColumns: string[] = ['Username', 'Email', 'Role', 'Status', 'Actions'];
  dataSource = new MatTableDataSource<APIdatas>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modal properties
  showAddUserModal = false;

  constructor() {
    this.getData();
    this.dataSource.filterPredicate = (data: APIdatas, filter: string) => {
      return data.Username.toLowerCase().includes(filter) || 
             data.Email.toLowerCase().includes(filter) ||
             data.Role.toLowerCase().includes(filter);
    };
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getData() {
    // Sample data directly in the component like your history page
    const sampleData: APIdatas[] = [
      {
        id: '1',
        Username: 'john.doe',
        Email: 'john.doe@example.com',
        Role: 'admin',
        Status: 'active',
        CreatedAt: '2024-01-15'
      },
      {
        id: '2',
        Username: 'jane.smith',
        Email: 'jane.smith@example.com',
        Role: 'user',
        Status: 'active',
        CreatedAt: '2024-01-20'
      },
      {
        id: '3',
        Username: 'robert.johnson',
        Email: 'robert.j@example.com',
        Role: 'user',
        Status: 'active',
        CreatedAt: '2024-02-01'
      },
      {
        id: '4',
        Username: 'sarah.williams',
        Email: 'sarah.w@example.com',
        Role: 'user',
        Status: 'inactive',
        CreatedAt: '2024-02-10'
      },
      {
        id: '5',
        Username: 'michael.brown',
        Email: 'michael.b@example.com',
        Role: 'admin',
        Status: 'active',
        CreatedAt: '2024-01-05'
      },
      {
        id: '6',
        Username: 'emily.davis',
        Email: 'emily.d@example.com',
        Role: 'user',
        Status: 'active',
        CreatedAt: '2024-02-15'
      },
      {
        id: '7',
        Username: 'david.miller',
        Email: 'david.m@example.com',
        Role: 'user',
        Status: 'active',
        CreatedAt: '2024-02-20'
      },
      {
        id: '8',
        Username: 'lisa.wilson',
        Email: 'lisa.w@example.com',
        Role: 'user',
        Status: 'inactive',
        CreatedAt: '2024-01-25'
      },
      {
        id: '9',
        Username: 'james.taylor',
        Email: 'james.t@example.com',
        Role: 'admin',
        Status: 'active',
        CreatedAt: '2023-12-10'
      },
      {
        id: '10',
        Username: 'patricia.martinez',
        Email: 'patricia.m@example.com',
        Role: 'user',
        Status: 'active',
        CreatedAt: '2024-01-30'
      },
      {
        id: '11',
        Username: 'kevin.anderson',
        Email: 'kevin.a@example.com',
        Role: 'user',
        Status: 'active',
        CreatedAt: '2024-02-05'
      },
      {
        id: '12',
        Username: 'nancy.thomas',
        Email: 'nancy.t@example.com',
        Role: 'user',
        Status: 'active',
        CreatedAt: '2024-02-18'
      }
    ];
    
    this.dataSource.data = sampleData;
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

  editUser(id: string) {
    console.log('Edit user:', id);
    // Add your edit logic here
  }

  deleteUser(id: string) {
    console.log('Delete user:', id);
    // Add your delete logic here
  }

  // Modal methods
  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }

  saveUser(userData: any) {
    console.log('Saving user:', userData);
    
    // Simulate API call
    setTimeout(() => {
      // Create new user object
      const newUserObj: APIdatas = {
        id: (this.dataSource.data.length + 1).toString(),
        Username: userData.username,
        Email: userData.email,
        Role: userData.role,
        Status: 'active',
        CreatedAt: new Date().toISOString().split('T')[0]
      };

      // Add to data source
      this.dataSource.data = [newUserObj, ...this.dataSource.data];
      
      // Close modal
      this.closeAddUserModal();
      
      console.log('User saved successfully:', newUserObj);
    }, 1000);
  }
}

export interface APIdatas {
  id: string;
  Username: string;
  Email: string;
  Role: string;
  Status: string;
  CreatedAt: string;
}