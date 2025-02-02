import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from "../../services/users/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userObj: any = {};  // Objet pour stocker les informations de l'utilisateur
  userId: string = '';  // ID de l'utilisateur connecté

  constructor(
    private profileService: UserService,
    private route: ActivatedRoute  // Injecter ActivatedRoute pour accéder aux paramètres d'URL
  ) { }

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis les paramètres d'URL
    this.route.params.subscribe(params => {
      this.userId = params['id'];  // Récupérer l'ID de l'utilisateur depuis l'URL
      this.getUserProfile();  // Récupérer les données de l'utilisateur
    });
  }

  // Méthode pour récupérer le profil de l'utilisateur par son ID
  getUserProfile(): void {
    this.profileService.getUserById(this.userId).subscribe(
      (response: any) => {
        this.userObj = response.user;  // Stocker les données dans userObj
      },
      (error: any) => {
        console.error('Erreur lors de la récupération du profil', error);
      }
    );
  }
}
