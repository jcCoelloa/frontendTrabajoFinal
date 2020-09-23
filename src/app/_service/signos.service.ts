import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Signos } from './../_model/signos';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignosService extends GenericService<Signos>{

  signosCambio = new Subject<Signos[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`
    );
   }
   listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}
