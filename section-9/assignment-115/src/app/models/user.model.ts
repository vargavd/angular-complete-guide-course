export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export class User {
  constructor(
    public name: string,
    public status: Status
  ) { }
}