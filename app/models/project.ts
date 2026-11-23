
import { Employee } from './employee';

export interface Project {
  id?: number;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  progress?: number;
  employees?: Employee[];
}
