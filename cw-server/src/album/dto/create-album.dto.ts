import { ObjectId } from 'mongoose';

export class CreateAlbumDto {
  readonly name: string;
  readonly year: number;
  readonly artistId: ObjectId;
  readonly genreId: ObjectId;
}
