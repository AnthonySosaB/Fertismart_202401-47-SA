export interface IUserProfile {
  first_name: string;
  last_name: string;
  email: string;
  groups: number[];
  is_active: boolean;
  username:  string;
  profile: {
    address: string;
    birthday: string;
    names: string;
    father_last_name: string;
    mother_last_name: string;
    country: string;
    type_document: number;
    num_document: string;
    telephone: string;
  }
}