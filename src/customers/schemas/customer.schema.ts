import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Customer extends Document {
  @Prop({ unique: true })
  corporateName: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  createdAt: string;

  @Prop()
  revenue: number;

  @Prop({ type: [Types.ObjectId], ref: 'BankAccount' })
  bankAccounts: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
