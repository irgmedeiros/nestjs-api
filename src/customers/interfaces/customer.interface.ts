import {Document} from 'mongoose';

export interface ICustomer extends Document {
  readonly corporateName: string;
  readonly phone: string;
  readonly address: string;
  readonly createdAt: string;
  readonly revenue: number;
}
