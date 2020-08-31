

export interface IProfile {
    username: string;
    displayName: string;
    bio: string;
    image: string;
    photos: IPhoto[];
    following: boolean;
    followerCount: number;
    followingCount: number;
}


export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
}