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

  displayedColumns: string[] = ['Username', 'Email', 'Role', 'Status'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  showAddUserModal = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (!response?.dashboard_data?.users) {
          console.error('Invalid API response');
          return;
        }

        const users = response.dashboard_data.users;
        console.log('Users array:', users);

        // Map the data correctly - ensure property names match
        const formattedUsers = users.map((user: any) => ({
          id: user.id,
          Username: user.username || '',
          Email: user.email || '',
          Role: user.role || 'user',
          Status: user.is_active ? 'active' : 'inactive'
        }));

        console.log('Formatted users:', formattedUsers);
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

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }

  onUserAdded(response: any) {
    this.loadUsers();
  }
}