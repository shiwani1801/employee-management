
import { Routes } from '@angular/router';
import { ProjectReports } from './pages/project-reports/project-reports';
import { Login } from './pages/login/login';
import { EmployeeList } from './pages/employee-list/employee-list';
import { AddEmployee } from './pages/add-employee/add-employee';
import { EditEmployee } from './pages/edit-employee/edit-employee';
import { Dashboard } from './pages/dashboard/dashboard';
import { employeeGuard } from './guards/employee.guard';
import { TaskProgress } from './pages/task-progress/task-progress';
import { TaskDetails } from './pages/task-details/task-details';
import { ProjectList } from './pages/project-list/project-list';
import { AddProject } from './pages/add-project/add-project';
import { EditProject } from './pages/edit-project/edit-project';
import { ProjectDetails } from './pages/project-details/project-details';
import { AddTask } from './pages/add-task/add-task';
import { EmployeeAssignment } from './pages/employee-assignment/employee-assignment';
import { EditTask } from './pages/edit-task/edit-task';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { TaskList } from './pages/task-list/task-list';
import { MyTasks } from './pages/my-tasks/my-tasks';
export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  {
    path: 'employees',
    component: EmployeeList,
    canActivate: [authGuard]
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'add-employee',
    component: AddEmployee,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'edit-employee/:id',
    component: EditEmployee,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'projects',
    component: ProjectList,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'add-project',
    component: AddProject,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'edit-project/:id',
    component: EditProject,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'project-details/:id',
    component: ProjectDetails,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'employee-assignment',
    component: EmployeeAssignment,
    canActivate: [authGuard, adminGuard]
  },
  {
  path: 'project-reports',
  component: ProjectReports,
  canActivate: [authGuard, adminGuard]
},
{
  path: 'tasks',
  component: TaskList,
  canActivate: [authGuard, adminGuard]
},
{
  path: 'add-task',
  component: AddTask,
  canActivate: [authGuard, adminGuard]
},
{
  path: 'edit-task/:id',
  component: EditTask,
  canActivate: [authGuard, adminGuard]
},
{
  path: 'task-details/:id',
  component: TaskDetails,
  canActivate: [authGuard, adminGuard]
},
{
  path: 'task-progress',
  component: TaskProgress,
  canActivate: [authGuard, adminGuard]
},

{
  path: 'my-tasks',
  component: MyTasks,
  canActivate: [authGuard, employeeGuard]
},
  { path: '**', redirectTo: 'login' }

];
