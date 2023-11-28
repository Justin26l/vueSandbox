export enum displayType {
  date = 'date',
  timeline = 'timeline'
}

export interface Day extends TaskByDate {
	day: number;
	date: number;
	month: number;
	year: number;
}

export interface TaskByDate {
    total: number;
    done: number;
    task?: Task[];
}

export interface Task {
  active: boolean;
  activityColor: string;
  activityStartDate: string;
  activityStartTime: string;
  activityEndDate: string;
  activityEndTime: string;
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