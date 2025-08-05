export interface Song {
    _id: string;
    title: string;
    lyrics: string;
    status?: number;
    uploadedBy?: string;
    uploadedByUsername?: string;
    createdAt?: string;
    updatedAt?: string;
}

export enum SongStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2
}

export const SongStatusLabels = {
    [SongStatus.PENDING]: 'Pending',
    [SongStatus.APPROVED]: 'Approved',
    [SongStatus.REJECTED]: 'Rejected'
};
