export interface StructuredReply {
  reply: string;
  action: string | null;
  confidence: number;
  sources: string[];
}
