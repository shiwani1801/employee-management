
import { Project } from './project';
import { Employee } from './employee';

export interface Task {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  deadline: string;
  status: string;
  priority?: string;
  project?: Project;
  employee?: Employee;
}
