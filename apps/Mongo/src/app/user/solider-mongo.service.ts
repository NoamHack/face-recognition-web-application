import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoliderDto } from './dto/solider.dto';
import { Solider, SoliderDocument } from './schema/solider.schema';

@Injectable()
export class SoliderMongoService {
  constructor(
    @InjectModel(Solider.name) private soliderModel: Model<SoliderDocument>
  ) {}

  async createSolider(soliderDto: SoliderDto): Promise<Solider> {
    const newSolider = new this.soliderModel(soliderDto);
    return newSolider.save();
  }
}
