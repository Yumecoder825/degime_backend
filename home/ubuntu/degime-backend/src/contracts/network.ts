import { Model, ObjectId } from 'mongoose'

export interface INetwork {
  user: ObjectId,
  connectors: ObjectId[]
}

export interface INetworkMethods {
}

export interface INetworkRequestPayload {
  from_id: string // user id
  from_name: string
  from_userId: string
  to: ObjectId 
}

export type NetworkModel = Model<INetwork, unknown, INetworkMethods>

export type AddConnectorPayload = {
  connector: ObjectId
}

export type RemoveConnectorPayload = {
  connector: ObjectId
}
