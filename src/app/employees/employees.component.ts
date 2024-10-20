import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeService } from "../service/employee.service";
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { Employee } from "../model/employee";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: true,
  imports: [RouterLink, NgFor, AsyncPipe, DatePipe]
})
export class EmployeesComponent implements OnInit {
  protected employeeService = inject(EmployeeService);
  employees$!: Observable<Employee[]>;

  ngOnInit() {
    this.employees$ = this.employeeService.getEmployees();
  }

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id)
        .then(() => {
          console.log('Employee deleted successfully');
          this.employees$ = this.employeeService.getEmployees();
        })
        .catch((error: Error) => {
          console.error('Error deleting employee:', error);
        });
    }
  }
}
