import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { Header } from '../../Components/header/header';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddUser } from '../../Components/add-user/add-user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    Header,
    RouterLink,
    CommonModule,
    AddUser
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Username', 'Email', 'Role', 'Status', 'Actions'];
  dataSource = new MatTableDataSource<APIdatas>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  showAddUserModal = false;

  constructor(private userService: UserService) {}

  // ✅ API call here
  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response) => {

        if (!response?.dashboard_data?.users) {
          console.error('Invalid API response');
          return;
        }

        const users = response.dashboard_data.users;

        const formattedUsers = users.map((user: any) => ({
          id: user.id,
          Username: user.username,
          Email: user.email,
          Role: user.role,
          Status: user.is_active ? 'active' : 'inactive',
          CreatedAt: ''
        }));

        this.dataSource.data = formattedUsers;
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }

  goToPage(index: number) {
    this.paginator.pageIndex = index;
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
  }

  deleteUser(id: string) {
    console.log('Delete user:', id);
  }

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }

  onUserAdded(response: any) {
    this.loadUsers(); // refresh after adding user
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
