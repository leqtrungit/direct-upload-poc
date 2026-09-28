export type UploadMode = "mock" | "integration";

export type CreateUploadSessionInput = {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  title: string;
};

export type CreateUploadSessionResult = {
  mode: UploadMode;
  sessionId: string;
  uploadUrl: string;
  expiresAt: string;
  channelAlias: string;
};
