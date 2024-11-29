import { Collection, ObjectId } from "mongodb";
import { Vuelo, VueloModel } from "./types.ts";
import { formModelToVuelo } from "./utils.ts";

export const resolvers = {
  Query: {
    getFlights: async (
      _: unknown,
      args: {origen?: string; destino?: string},
      context: { vuelosCollection: Collection<VueloModel> }
    ): Promise<Vuelo[]> => {
        let vuelosModel
        if(args.origen && args.destino){
            vuelosModel = await context.vuelosCollection.find({
                origen: args.origen,
                destino: args.destino
            }).toArray()
        }
        else if(args.destino){
            vuelosModel = await context.vuelosCollection.find({
                destino: args.destino,
            }).toArray()
        }
        else if(args.origen){
            vuelosModel = await context.vuelosCollection.find({
                origen: args.origen,
              }).toArray();
        }
        else{
            vuelosModel = await context.vuelosCollection.find().toArray();
        }
        return vuelosModel.map((vueloModel) => formModelToVuelo(vueloModel));
    },
    getFlight: async (
      _: unknown,
      { id }: { id: string },
      context: { vuelosCollection: Collection<VueloModel> }
    ): Promise<Vuelo | null> => {
      const vuelosModel = await context.vuelosCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!vuelosModel) {
        return null;
      }
      return formModelToVuelo(vuelosModel);
    },
  },
  Mutation: {
    addFlight: async (
      _: unknown,
      args: { origen: string; destino: string; fecha:string},
      context: { vuelosCollection: Collection<VueloModel> }
    ): Promise<Vuelo> => {
      const { origen, destino, fecha } = args;
      const { insertedId } = await context.vuelosCollection.insertOne({
        origen,
        destino,
        fecha
      });
      const vueloModel = {
        _id: insertedId,
        origen,
        destino,
        fecha
      };
      return formModelToVuelo(vueloModel!);
    },
  },
};