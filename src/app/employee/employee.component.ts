import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { EmployeeService } from "../service/employee.service";
import { Router, RouterLink } from "@angular/router";
import { Employee } from "../model/employee";
import { NgIf } from '@angular/common';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf]
})
export class EmployeeComponent implements OnInit {
  private builder: FormBuilder = inject(FormBuilder);
  private employeeService: EmployeeService = inject(EmployeeService);
  private router: Router = inject(Router);
  private firestore: Firestore = inject(Firestore);


  employeeForm = this.builder.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(0)]],
    gender: ['', [Validators.required, Validators.pattern('^[MFX]$')]],
    email: ['', [Validators.required, Validators.email]]
  });

  get name(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('name'); }
  get dateOfBirth(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('dateOfBirth'); }
  get city(): AbstractControl<string> { return <AbstractControl>this.employeeForm.get('city'); }
  get salary(): AbstractControl<number> { return <AbstractControl<number>>this.employeeForm.get('salary'); }
  get gender(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('gender'); }
  get email(): AbstractControl<string> { return <AbstractControl<string>>this.employeeForm.get('email'); }

  ngOnInit(): void {
    this.getEmployees();
  }

  async getEmployees() {
    try {
      const employeesCollection = collection(this.firestore, 'employees');
      const querySnapshot = await getDocs(employeesCollection);
      const employees: Employee[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));

      console.log('Fetched employees:', employees);

      if (employees.length > 0) {
        const employee = employees[0];
        this.employeeForm.patchValue({
          name: employee.name,
          dateOfBirth: new Date(employee.dateOfBirth).toISOString().split('T')[0],
          city: employee.city,
          salary: employee.salary,
          gender: employee.gender,
          email: employee.email
        });
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  }

  async onSubmit() {
    if (this.employeeForm.valid) {
      const employee: Employee = {
        id: "",
        name: this.name.value,
        dateOfBirth: this.dateOfBirth.value,  // Keep as string
        city: this.city.value,
        salary: this.salary.value,
        gender: this.gender.value,
        email: this.email.value,
        toFirestore: function () {
          return {
            name: this.name,
            dateOfBirth: new Date(this.dateOfBirth),  // Convert to Date here
            city: this.city,
            salary: this.salary,
            gender: this.gender,
            email: this.email
          };
        }
      };

      if (new Date(this.dateOfBirth.value).getFullYear() > 9999) {
        console.error('Date is out of range');
        return;
      }

      try {
        const employeesCollection = collection(this.firestore, 'employees');
        const docRef = await addDoc(employeesCollection, employee.toFirestore());
        console.log("Document written with ID: ", docRef.id);
        this.employeeForm.reset();
        await this.router.navigate(['/employees']);
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    }
  }

  save() {
    console.log('Saving employee...');
    this.onSubmit();
  }

  delete() {
    this.employeeForm.reset();
  }
}
