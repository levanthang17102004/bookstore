
export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string | string[];
        statusCode: number | string;
        data?: T;
}
    interface IRegister {
        id: string
    }

    interface IUserLogin{
        user: {
            id: string,
            email: string,
            fcmTokens: [],
            photo: string,
            phone: string,
            name: string,
            address: string
        };
        accesstoken: string
    }

    interface ITopBookStore {
        _id: string,
        name: string,
        phone: string,
        address:string,
        email: string,
        rating: number,
        image: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
    }
}