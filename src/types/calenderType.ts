export enum displayType {
  month,
  week,
}

export interface dateObj extends TaskByDate {
  date: Date;
}

export interface TaskByDate {
  total: number;
  done: number;
  task: Task[];
}

export interface Task {
  id: string;
  active: boolean;
  done: boolean;
  activityColor: string;
  StartDate: Date;
  EndDate: Date;
  [key: string]: any;
}

export interface CalenderDataItem {
  year: number;
  month: number;
  taskByDate: TaskByDate[];
  // task by date is array index from 0 to 31,
  // index define the date of month
  // so index 0 is not used
}
