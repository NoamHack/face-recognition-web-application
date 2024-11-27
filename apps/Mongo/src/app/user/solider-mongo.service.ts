import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoliderDto } from './dto/solider.dto';
import { Solider, SoliderDocument } from './schema/solider.schema';
import { SoliderPicsDto } from './dto/solider-pics.dto';
import { SoliderPics, SoliderPicsDocument } from './schema/solider-pics.schema';

@Injectable()
export class SoliderMongoService {
  constructor(
    @InjectModel(Solider.name) private soliderModel: Model<SoliderDocument>,
    @InjectModel(SoliderPics.name)
    private soliderPicsModel: Model<SoliderPicsDocument>
  ) {}

  async createSolider(soliderDto: SoliderDto): Promise<Solider> {
    const newSolider = new this.soliderModel(soliderDto);
    return newSolider.save();
  }

  createSoliderPics(soliderPicsDto: SoliderPicsDto) {
    const newSoliderPics = new this.soliderPicsModel(soliderPicsDto);
    return newSoliderPics.save();
  }
}
