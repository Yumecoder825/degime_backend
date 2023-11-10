import { Model, ObjectId } from 'mongoose'

export interface INetwork {
  user: ObjectId,
  connectors: ObjectId[]
}

export interface INetworkMethods {
}

export type NetworkModel = Model<INetwork, unknown, INetworkMethods>

export type AddConnectorPayload = {
  connector: ObjectId
}

export type RemoveConnectorPayload = {
  connector: ObjectId
}
