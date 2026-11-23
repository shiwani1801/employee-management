
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  // ADMIN: Get all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Get task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // ADMIN: Add task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // ADMIN: Update task
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // ADMIN: Delete task
  deleteTask(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }

  // Get tasks by project
  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/project/${projectId}`
    );
  }

  // ADMIN: Get tasks by employee
  getTasksByEmployee(employeeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/employee/${employeeId}`
    );
  }

  // Get tasks by status
  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/status/${status}`
    );
  }

  // EMPLOYEE: Get own tasks
  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/my-tasks`
    );
  }

  // EMPLOYEE: Update own task status
  updateMyTaskStatus(
    taskId: number,
    status: string
  ): Observable<Task> {
    return this.http.patch<Task>(
      `${this.apiUrl}/${taskId}/status`,
      { status }
    );
  }

  // EMPLOYEE: Add comment to own task
  addMyTaskComment(
    taskId: number,
    commentText: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${taskId}/comments`,
      { commentText }
    );
  }

  // EMPLOYEE: Get saved comments for own task
  getMyTaskComments(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/${taskId}/comments`
    );
  }

}
