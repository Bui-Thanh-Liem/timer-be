import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base, BaseSchema } from './base.schema';
import { IToken } from 'src/interfaces/models';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true})
export class Token extends Base implements IToken {
  @Prop({ required: true })
  token_code: string;

  @Prop({ required: true })
  token_secretKey: string;

  @Prop({ required: true })
  token_user: string;

  // @Prop({
  //   type: Date,
  //   default: Date.now,
  //   expires: 259200
  // })
  // expireAt: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.add(BaseSchema);
