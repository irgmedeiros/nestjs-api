import { Document } from 'mongoose';

export interface IBankAccount extends Document {
  readonly bankName: string;
  readonly agency: string;
  readonly account: string;
}
