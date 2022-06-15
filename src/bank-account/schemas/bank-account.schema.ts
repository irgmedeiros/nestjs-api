import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema()
export class BankAccount extends Document {
  @Prop({ unique: true })
    bankName: string

  @Prop()
    agency: string

  @Prop()
    account: string

  @Prop({ type: [Types.ObjectId], ref: 'Customer' })
    customers: string
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount)
