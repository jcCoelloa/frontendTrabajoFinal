import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignosService } from './../../_service/signos.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Signos } from './../../_model/signos';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idSigno', 'nombres', 'apellidos', 'ritmoRespiratorio', 'temperatura', 'pulso', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private signosService: SignosService,
    private snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.signosService.signosCambio.subscribe(data =>{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signosService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO',{
        duration: 2000
      });
    });

    this.signosService.listarPageable(0, 10).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLowerCase();

  }

  eliminar(idSigno: number){
    this.signosService.eliminar(idSigno).subscribe(() =>{
      this.signosService.listar().subscribe(data =>{
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next('SE ELIMINO');
      });
    });
  }

  mostrarMas(e: any){
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data =>{
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }



}
