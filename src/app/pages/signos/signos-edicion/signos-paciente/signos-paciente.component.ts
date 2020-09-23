import { SignosEdicionComponent } from './../signos-edicion.component';
import { FormGroup, FormControl } from '@angular/forms';
import { PacienteService } from './../../../../_service/paciente.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paciente } from './../../../../_model/paciente';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-signos-paciente',
  templateUrl: './signos-paciente.component.html',
  styleUrls: ['./signos-paciente.component.css']
})
export class SignosPacienteComponent implements OnInit {

  paciente: Paciente;
  form: FormGroup;
  @Output() idPacienteEmitter = new EventEmitter();


  constructor(
    public dialogRef: MatDialogRef<SignosPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService
  ) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(0),
      'telefono': new FormControl(0),
      'direccion': new FormControl('')
    });

  }

  operar() {
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    this.pacienteService.registrar(paciente).subscribe(() => {
      this.pacienteService.listar().subscribe(data => {
        this.pacienteService.pacienteCambio.next(data);
        this.dialogRef.close(data.pop().idPaciente);

      });
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  emitir(){
    this.idPacienteEmitter.emit('prueba');
  }


}
