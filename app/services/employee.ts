
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Employee } from '../models/employee';

// @Injectable({
//   providedIn: 'root'
// })
// export class EmployeeService {

//   private apiUrl = 'http://localhost:8080/api/employees';

//   constructor(private http: HttpClient) {}

//   getAllEmployees(): Observable<Employee[]> {
//     return this.http.get<Employee[]>(this.apiUrl);
//   }

//   getEmployeeById(id: number): Observable<Employee> {
//     return this.http.get<Employee>(
//       `${this.apiUrl}/${id}`
//     );
//   }

//   addEmployee(employee: Employee): Observable<Employee> {
//     return this.http.post<Employee>(
//       this.apiUrl, employee
//     );
//   }

//   updateEmployee(id: number, employee: Employee): Observable<Employee> {
//     return this.http.put<Employee>(
//       `${this.apiUrl}/${id}`, employee
//     );
//   }

//   deleteEmployee(id: number): Observable<string> {
//     return this.http.delete(
//       `${this.apiUrl}/${id}`,
//       { responseType: 'text' }
//     );
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  // Get all employees
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(
      `${this.apiUrl}/${id}`
    );
  }

  // Add employee
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(
      this.apiUrl,
      employee
    );
  }

  // Update employee
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  // Deactivate employee
  deactivateEmployee(id: number): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/${id}/deactivate`,
      {},
      { responseType: 'text' }
    );
  }
}

