import { Observable } from 'rxjs';
import { LoginService } from './../../_service/login.service';
import { environment } from './../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  infoToken: any;

  constructor(
  ) { }

  ngOnInit(): void {
    this.decodificarToken();
  }

  decodificarToken(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const helper = new JwtHelperService();
    this.infoToken = helper.decodeToken(token);
  }
}
