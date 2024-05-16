export interface IEventData {
    _id: string;
    title: string;
    description: string;
    eventDate: string;
    organizer: string;
    participants: any[]; // You can replace 'any' with the actual type of participants if known
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export interface IPaginationInfo {
    pageNumber: number;
    limit: number;
}

export interface IApiResponse {
    msg: string;
    data: {
        totalEvents: number;
        totalPages: number;
        previous?: IPaginationInfo;
        next?: IPaginationInfo;
        items: IEventData[];
        limit: number;
    };
}

export interface IParticipant {
    name: string;
    email: string;
    dateOfBirthday: Date;
    foundUsBy: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }