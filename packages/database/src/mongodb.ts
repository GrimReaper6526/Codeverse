import mongoose, { Schema, Document } from 'mongoose';

// 1. Repository Graph Document Interface & Schema
export interface IRepositoryGraphDocument extends Document {
  repositoryId: string;
  nodes: Array<{ id: string; name: string; type: string; symbolCount: number }>;
  edges: Array<{ id: string; source: string; target: string; strength: number }>;
  generatedAt: Date;
}

const RepositoryGraphSchema = new Schema<IRepositoryGraphDocument>({
  repositoryId: { type: String, required: true, index: true },
  nodes: { type: Array, default: [] },
  edges: { type: Array, default: [] },
  generatedAt: { type: Date, default: Date.now },
});

export const RepositoryGraphModel =
  mongoose.models.RepositoryGraph ||
  mongoose.model<IRepositoryGraphDocument>('RepositoryGraph', RepositoryGraphSchema);

// 2. AI Memory Document Interface & Schema
export interface IAIMemoryDocument extends Document {
  repositoryId: string;
  conversationId: string;
  summary: string;
  updatedAt: Date;
}

const AIMemorySchema = new Schema<IAIMemoryDocument>({
  repositoryId: { type: String, required: true, index: true },
  conversationId: { type: String, required: true, index: true },
  summary: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const AIMemoryModel =
  mongoose.models.AIMemory ||
  mongoose.model<IAIMemoryDocument>('AIMemory', AIMemorySchema);

// MongoDB Helper Connector
export async function connectMongoDB(uri: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }
  return await mongoose.connect(uri);
}
