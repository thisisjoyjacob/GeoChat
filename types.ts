
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type GroundingChunkContent = {
  uri: string;
  title: string;
};

export type GroundingChunk = {
  web?: GroundingChunkContent;
  maps?: GroundingChunkContent;
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingChunks?: GroundingChunk[];
}
