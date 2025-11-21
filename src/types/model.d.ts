
export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string | string[];
        statusCode: number | string;
        data?: T;
        duration?: number;
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

    // Backward compatibility alias - ITopRestaurant maps to ITopBookStore
    interface ITopRestaurant {
        _id: string,
        name: string,
        phone?: string,
        address?: string,
        email?: string,
        rating: number,
        image?: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
    }

    // Backward compatibility alias - IRestaurant maps to IBookstore with category
    interface IRestaurant extends Omit<IBookstore, 'category'> {
        menu: IMenu[]; // Maps to category[]
        isLike: boolean;
    }

    // Backward compatibility alias - IMenu maps to ICategory
    interface IMenu {
        _id: string;
        bookstore: string; // Maps from restaurant
        title: string;
        name: string; // Same as title
        createdAt: Date;
        updatedAt?: Date;
        menuItem: IMenuItem[] // Maps to book[]
    }
    
    // Backward compatibility alias - IMenuItem maps to IBook  
    interface IMenuItem {
        _id: string;
        category?: string; // Maps from menu
        menu?: string; // Maps from category (backward compatibility)
        title: string;
        author?: string; // Author field for book
        description?: string;
        basePrice?: number; // Maps to price
        price: number; // Primary price field
        image?: string;
        quantity?: number; // Stock quantity
        options?: {
            title: string;
            description: string;
            additionalPrice: number;
        }[], // Books don't have options, but keep for backward compatibility
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICart {
        [key: string]: {
            sum: number;
            quantity: number;
        items: {
            [key: string]: {
                quantity: number;
                data: IBook | IMenuItem; // Support both for backward compatibility
                extra?: {
                    [key: string]: number;
                }
    }
    }
    }
    }

    // Order interface matching backend schema
    interface IOrderHistory {
        _id: string;
        user: string;
        status: 'pending' | 'processing' | 'delivered' | 'cancelled';
        paymentStatus: 'unpaid' | 'paid';
        totalPrice: number;
        totalQuantity: number;
        detail: {
            book: string | IBook; // Book ID or populated book
            title: string;
            author?: string;
            price: number;
            quantity: number;
            image?: string;
            category?: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
        orderTime?: Date; // Backward compatibility
        bookstore?: IBookstore; // Not in backend, keep for compatibility
        restaurant?: IRestaurant; // Backward compatibility
    }

    // Notification interface matching backend schema
    interface INotification {
        _id: string;
        user: string;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        // Backward compatibility fields (not in backend)
        bookstore?: IBookstore;
        restaurant?: IRestaurant;
        status?: string;
        detail?: {
            image: string;
            title: string;
        }[];
    }
        
    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        results: T[];
        }


    // Like interface matching backend schema (polymorphic)
    interface ILike {
        _id: string;
        user: string | IUserLogin['user'];
        itemType: 'book' | 'bookstore';
        itemId: string; // References either book or bookstore
        book?: IBook; // Populated if itemType is 'book'
        bookstore?: IBookstore; // Populated if itemType is 'bookstore'
        createdAt: Date;
        updatedAt: Date;
    }

    // Backward compatibility alias - ILikeRestaurant maps to ILike
    interface ILikeRestaurant {
        _id: string; 
        bookstore: IBookstore; // Maps from restaurant
        restaurant?: IRestaurant; // Backward compatibility
        user: string; 
        quantity?: number; // Not in backend, keep for compatibility
        createdAt: Date; 
        updatedAt: Date; 
    }

    interface ICategory {
        _id: string;
        name: string;
        description?: string;
        bookstore?: string | IBookstore;
        createdAt: Date;
        updatedAt?: Date;
        book?: IBook[]; // Books in this category
    }

    interface IBook {
        _id: string;
        title: string;
        author: string;
        price: number;
        description?: string;
        image?: string;
        category: string | ICategory; // Can be ObjectId string or populated Category object
        quantity: number; // Stock quantity
        createdAt: Date;
        updatedAt: Date;
    }

    interface IBookstore {
        _id: string;
        name: string;
        owner?: string;
        phone?: string;
        address?: string;
        email?: string;
        description?: string;
        rating: number;
        image?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        category?: ICategory[]; // Categories (menus) for this bookstore
        isLike?: boolean; // Whether current user likes this bookstore
    }

    interface ILikeBookstore {
        _id: string;
        bookstore: IBookstore;
        user: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    }

    interface ITopBookStore {
        _id: string;
        name: string;
        phone?: string;
        address?: string;
        email?: string;
        rating: number;
        image?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    // Review interface matching backend schema
    interface IReview {
        _id: string;
        book: string | IBook; // Book ID or populated book
        user: string | IUserLogin['user'];
        rating: number; // 1-5
        comment?: string;
        createdAt: Date;
        updatedAt: Date;
    }

    // User interface (matching backend User schema)
    interface IUser {
        _id: string;
        name: string;
        email: string;
        password?: string; // Usually not included in responses
        photoUrl?: string;
        isVerified: boolean;
        verificationCode?: number;
        verificationExpires?: Date;
        fcmTokens: string[];
        phone?: string;
        address?: string;
        createdAt: Date;
        updatedAt: Date;
    }

}