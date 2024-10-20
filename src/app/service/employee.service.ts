import { Injectable, inject } from '@angular/core';
import { Observable } from "rxjs";
import { Employee } from "../model/employee";
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private firestore: Firestore = inject(Firestore);
  private employeesCollection = collection(this.firestore, 'employees');

  getEmployees(): Observable<Employee[]> {
    return collectionData(this.employeesCollection, { idField: 'id' })
      .pipe(map(data => data as Employee[]));
  }

  async addEmployee(employee: Employee): Promise<void> {
    const docRef = doc(this.employeesCollection);
    const id = docRef.id;
    return setDoc(docRef, { ...employee, id });
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const docRef = doc(this.employeesCollection, employee.id);
    return updateDoc(docRef, { ...employee });
  }

  async deleteEmployee(id: string): Promise<void> {
    const docRef = doc(this.employeesCollection, id);
    return deleteDoc(docRef);
  }
}