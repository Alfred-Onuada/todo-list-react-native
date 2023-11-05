export interface ITasks {
  id: number;
  title: string;
  notes: string;
  due: Date;
  completed: boolean;
  completedOn: Date | null;
}