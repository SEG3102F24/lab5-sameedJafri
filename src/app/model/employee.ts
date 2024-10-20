export interface Employee {
  id: string;
  name: string;
  dateOfBirth: string;  // Change this to string
  city: string;
  salary: number;
  gender: string;
  email: string;
  toFirestore(): { [key: string]: any };
}
