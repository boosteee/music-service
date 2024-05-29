import { ObjectId } from 'mongoose';

export class CreateTrackDto {
  readonly name: string;
  readonly albumId: ObjectId;
  readonly feat?: ObjectId[];
}
