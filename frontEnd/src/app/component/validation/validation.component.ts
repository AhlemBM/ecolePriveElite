import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  users: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getPendingUsers();
  }

  getPendingUsers(): void {
    this.adminService.getPendingUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    );
  }

  validateUser(userId: string): void {
    this.adminService.validateUser(userId).subscribe(
      () => {
        this.users = this.users.map(user =>
          user._id === userId ? { ...user, isActive: true } : user
        );
      },
      (error) => {
        console.error('Erreur lors de la validation', error);
      }
    );
  }

  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user._id !== userId);
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      );
    }
  }
}
