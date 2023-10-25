import { ObjectId } from 'mongoose'
import { Network } from '@/models'

class NetworkService {
  create(userId: ObjectId, connector?: ObjectId) {
    const connectors: ObjectId[] = [];
    if(connector) {
      connectors.push(connector)
    }
    return new Network({
      user: userId,
      connectors: connectors
    }).save()
  }
  async getViewDataByUserId(userId: ObjectId) {
    let network = await Network.findOne({ user: userId }).populate({
      path: 'connectors',
    });
    if(!network) {
      network = await this.create(userId)
    }
    return network;
  }
  async getByUserId(userId: ObjectId) {
    let network = await Network.findOne({ user: userId });
    if(!network) {
      network = await this.create(userId)
    }
    return network;
  }

  async addConnector(userId: ObjectId, connector: ObjectId) {
    const network = await this.getByUserId(userId);
    network.connectors.push(connector);
    await network.save();
    await this.addConnector(connector, userId)

    return network;
  }

  async removeConnector(userId: ObjectId, connector: ObjectId) {
    const network = await this.getByUserId(userId);
    const index = network.connectors.findIndex(c => c == connector)
    if(index > -1) {
      const pre = network.connectors.slice(0, index);
      const sub = network.connectors.slice(index, network.connectors.length);
      network.connectors = [...pre, ...sub];
    }
    await network.save();
    await this.removeConnector(connector, userId);

    return network;
  }
}

export const networkService = new NetworkService()
