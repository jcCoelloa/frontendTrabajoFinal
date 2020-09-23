import { SignosPacienteComponent } from './signos-paciente/signos-paciente.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Paciente } from './../../../_model/paciente';
import { Observable } from 'rxjs';
import { PacienteService } from './../../../_service/paciente.service';
import { Signos } from './../../../_model/signos';
import { SignosService } from './../../../_service/signos.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  pacientes: Paciente[];
  idPacienteSeleccionado: number;
  message: string;

  pacienteDialogRef: MatDialogRef<SignosPacienteComponent>;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosService,
    private pacienteService: PacienteService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.listarPacientes();
    this.form = new FormGroup({
      'idSigno': new FormControl(0),
      'temperatura': new FormControl(0),
      'ritmoRespiratorio': new FormControl(0),
      'pulso': new FormControl(''),
      'idPaciente': new FormControl(0),
      'fecha': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data ['id'] != null;
      this.initForm();
    });
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  get f() { return this.form.controls; }

  initForm(){
    if (this.edicion){
      this.signosService.listarPorId(this.id).subscribe(data =>{
        this.form = new FormGroup({
          'idSigno': new FormControl(data.idSigno),
          'temperatura': new FormControl(data.temperatura),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio),
          'pulso': new FormControl(data.pulso),
          'idPaciente': new FormControl(data.paciente.idPaciente),
          'fecha': new FormControl(data.fecha)
        });
        this.pacienteService.listarPorId(data.paciente.idPaciente).subscribe(data => {
          this.idPacienteSeleccionado = data.idPaciente;
        });
      });
    }
  }

  operar(){

    let signos = new Signos();
    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;
    signos.idSigno = this.form.value['idSigno'];
    signos.paciente = paciente;
    signos.pulso = this.form.value['pulso'];
    signos.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];
    signos.temperatura = this.form.value['temperatura'];
    signos.fecha = this.form.value['fecha'];
    if (this.edicion) {
      this.signosService.modificar(signos).subscribe(() => {
        this.signosService.listar().subscribe(data =>{
          this.signosService.signosCambio.next(data);
          this.signosService.mensajeCambio.next('SE MODIFICO');
        });
      });
    } else {
      this.signosService.registrar(signos).subscribe(() => {
        this.signosService.listar().subscribe(data => {
          this.signosService.signosCambio.next(data);
          this.signosService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['signos']);
  }

  cambieFecha(e: any) {
    console.log(e);
  }

  public seleccionarPaciente(p: any) {
    this.idPacienteSeleccionado = p.option.value;
  }

  abrirDialogoPaciente(){
    this.pacienteDialogRef = this.dialog.open(SignosPacienteComponent, {height:'400px',width:'250px'});
    this.pacienteDialogRef.afterClosed().subscribe(result =>{
        this.listarPacientes();
        this.idPacienteSeleccionado = result
        this.form.controls.idPaciente.patchValue(result);
      });

    }

}
