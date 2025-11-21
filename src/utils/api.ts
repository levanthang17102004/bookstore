import axios from "@/utils/axios.customize"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"

export const registerAPI = (email: string, password: string, name: string) => {
    const url = `/auth/register`
    return axios.post<IBackendRes<IRegister>>(url, { email, password, name })
}

export const verifyCodeAPI = (email: string, code: string) => {
    const url = `/auth/verification`
    return axios.post<IBackendRes<IRegister>>(url, { email, code })
}

export const resendCodeAPI = (email: string, code: string) => {
    const url = `/auth/register`
    return axios.post<IBackendRes<IRegister>>(url, { email, code })
}

export const loginAPI = (email: string, password: string) => {
    const url = `/auth/login`
    return axios.post<IBackendRes<IUserLogin>>(url, { email, password })
}

export const resetPasswordAPI = (email: string) => {
    const url = `/auth/forgotPassword`
    return axios.post<IBackendRes<IRegister>>(url, { email })
}

export const getAccountAPI = () => {
    const url = `/auth/get-account`
    return axios.get<IBackendRes<IRegister>>(url)
}

// Backward compatibility - maps to bookstore endpoint
// Backend routes: GET /bookstore/top-rating, GET /bookstore/new, GET /bookstore/top-freeship
export const getTopRestaurantAPI = (ref: string) => {
    // Map ref to backend route
    const routeMap: { [key: string]: string } = {
        'top-rating': '/bookstore/top-rating',
        'newcommer': '/bookstore/new',
        'top-freeship': '/bookstore/top-freeship'
    };
    
    const url = routeMap[ref] || `/bookstore/${ref}`;
    console.log('>>getTopRestaurantAPI calling:', url, 'with ref:', ref);
    
    // Backend uses GET method
    return axios.get<IBackendRes<ITopBookStore[]>>(url, {
        headers: {delay: 3000}
    }).then(response => {
        // Axios interceptor already returns response.data, so response is IBackendRes<ITopBookStore[]>
        console.log('>>getTopRestaurantAPI response:', response);
        console.log('>>Response type:', typeof response, 'Is array:', Array.isArray(response));
        console.log('>>Response.data:', response?.data);
        
        // Handle different response structures
        let result: IBackendRes<ITopBookStore[]>;
        
        if (response?.data && Array.isArray(response.data)) {
            // Structure: { data: [...] } (IBackendRes format)
            result = {
                ...response,
                data: response.data.map((item: any) => ({
                    ...item,
                    rating: item.rating || 0,
                    isActive: item.isActive !== undefined ? item.isActive : true,
                }))
            };
        } else if (Array.isArray(response)) {
            // Structure: [...] (direct array - interceptor unwrapped)
            result = {
                data: response.map((item: any) => ({
                    ...item,
                    rating: item.rating || 0,
                    isActive: item.isActive !== undefined ? item.isActive : true,
                })),
                message: 'success',
                statusCode: 200
            } as IBackendRes<ITopBookStore[]>;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
            // Structure: { data: { data: [...] } }
            result = response;
        } else {
            // Unknown structure
            console.warn('>>Unknown response structure:', response);
            result = {
                data: [],
                message: 'Unknown response structure',
                statusCode: 200
            } as IBackendRes<ITopBookStore[]>;
        }
        
        console.log('>>Processed result:', result);
        return result;
    }).catch(error => {
        console.error('>>getTopRestaurantAPI error:', error);
        console.error('>>Error details:', {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status
        });
        // Return empty result on error
        return {
            data: [],
            message: error?.message || 'Failed to fetch',
            statusCode: error?.response?.status || 500,
            error: error?.response?.data?.error || error?.message
        } as IBackendRes<ITopBookStore[]>;
    });
}

// Backward compatibility - maps to bookstore endpoint and transforms data structure
export const getRestaurantByIdAPI = (id: string) => {
    const url = `/bookstore/${id}`    
    return axios.get<IBackendRes<IBookstore>>(url, {
        headers: {delay: 3000}
    }).then(response => {
        if (response.data?.data) {
            return {
                ...response,
                data: {
                    ...response.data,
                    data: transformBookstoreToRestaurant(response.data.data)
                }
            };
        }
        return response;
    })
}

export const getURLBaseBackend = () => {
    const backend = Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_ANDROID_API_URL
      : process.env.EXPO_PUBLIC_IOS_API_URL;
  
    return backend;
  };

//check async storage
export const printAsyncStorage = () => {
    AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys!, (error, stores) => {
    let asyncStorage: any = {}
    stores?.map((result, i, store) => {
    asyncStorage[store[i][0]] = store[i][1]
});
    console.log(JSON.stringify(asyncStorage, null, 2));
});
 });
};
    

// Backward compatibility - maps bookstore category to restaurant menu format
export const processDataRestaurantMenu = (restaurant: IRestaurant | IBookstore | null) => {
    if (!restaurant) return [];
    // If it's already in IRestaurant format with menu
    if ('menu' in restaurant && Array.isArray((restaurant as IRestaurant).menu)) {
        return (restaurant as IRestaurant).menu.map((menu, index) => {
            return {
                index,
                key: menu._id,
                title: menu.title || menu.name,
                data: menu.menuItem || []
            }
        });
    }
    // If it's IBookstore format with category
    const bookstore = restaurant as IBookstore;
    return (bookstore.category || []).map((category, index) => {
        return {
            index,
            key: category._id,
            title: category.name,
            data: category.book || []
        }
    });
}

export const currencyFormatter = (value: any) => {
    const options = {
        signicantDigits: 2,
        thousandsSeparator: '.',
        decimalSeparator: ',',
        symbol: 'đ'
    }
    if (typeof value !== 'number') value = 0.0
        value = value.toFixed(options.signicantDigits)
    const [currency, decimal] = value.split('.')
        return `${currency.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            options.thousandsSeparator
        )} ${options.symbol}`
}
    

// Place order - matches backend route: POST /order
export const placeOrderAPI = (data: {
    totalPrice: number;
    totalQuantity: number;
    detail: Array<{
        book: string;
        title: string;
        author?: string;
        price: number;
        quantity: number;
        image?: string;
        category?: string;
    }>;
}) => {
    const url = '/order';
    return axios.post<IBackendRes<IOrderHistory>>(url, { ...data });
};


//Trước cải tiến
// export const getOrderHistoryAPI = () => {
//     const url = '/order';
//     return axios.get<IBackendRes<IOrderHistory[]>>(url);
// };

//Sau cải tiến - matches backend route: GET /order?page=1&limit=10
export const getOrderHistoryAPI = (page: number = 1, limit: number = 10) => {
    const url = `/order?page=${page}&limit=${limit}`;
    return axios.get<IBackendRes<IOrderHistory[]>>(url);
};

// Update payment status - matches backend route: PUT /order/:orderId/payment-status
export const updatePaymentStatusAPI = (orderId: string, paymentStatus: 'paid' | 'unpaid') => {
    const url = `/order/${orderId}/payment-status`;
    return axios.put<IBackendRes<IOrderHistory>>(url, { paymentStatus });
};


// Backward compatibility - uses updateUserProfileAPI
export const updateUserAPI = (_id: string, name: string, phone: string) => {
    return updateUserProfileAPI(name, phone);
};

// Like API - matches backend route: POST /:itemType/:itemId
export const toggleLikeAPI = (itemType: 'book' | 'bookstore', itemId: string) => {
    const url = `/like/${itemType}/${itemId}`;
    return axios.post<IBackendRes<ILike>>(url);
};

// Check like status - matches backend route: GET /:itemType/:itemId/status
export const checkLikeStatusAPI = (itemType: 'book' | 'bookstore', itemId: string) => {
    const url = `/like/${itemType}/${itemId}/status`;
    return axios.get<IBackendRes<{ isLiked: boolean }>>(url);
};

// Get like count - matches backend route: GET /:itemType/:itemId/count
export const getLikeCountAPI = (itemType: 'book' | 'bookstore', itemId: string) => {
    const url = `/like/${itemType}/${itemId}/count`;
    return axios.get<IBackendRes<{ count: number }>>(url);
};

// Get liked books - matches backend route: GET /books
export const getLikedBooksAPI = () => {
    const url = '/like/books';
    return axios.get<IBackendRes<ILike[]>>(url);
};

// Get liked bookstores - matches backend route: GET /bookstores
export const getLikedBookstoresAPI = () => {
    const url = '/like/bookstores';
    return axios.get<IBackendRes<ILike[]>>(url);
};

// Backward compatibility - maps to toggleLikeAPI for bookstore
export const likeRestaurantAPI = (bookstore: string, quantity: number) => {
    // Backend doesn't use quantity, but we keep it for compatibility
    return toggleLikeAPI('bookstore', bookstore);
};

// Backward compatibility - maps to getLikedBookstoresAPI
export const getFavoriteRestaurantAPI = () => {
    return getLikedBookstoresAPI().then(response => {
        // Transform ILike[] to ILikeBookstore[] format for backward compatibility
        if (response.data?.data) {
            return {
                ...response,
                data: {
                    ...response.data,
                    data: response.data.data
                        .filter(like => like.itemType === 'bookstore' && like.bookstore)
                        .map(like => ({
                            _id: like._id,
                            bookstore: like.bookstore!,
                            user: typeof like.user === 'string' ? like.user : like.user.id,
                            quantity: 1,
                            createdAt: like.createdAt,
                            updatedAt: like.updatedAt,
                        } as ILikeBookstore))
                }
            };
        }
        return response;
    });
};

// Backward compatibility - not in backend, but keep for compatibility
export const deleteLikeRestaurantAPI = () => {
    // Backend uses toggleLike to unlike, so this is a no-op or should use toggleLike
    return Promise.resolve({} as any);
};

// Get notifications - matches backend route: GET /notification
export const getNotificationsAPI = () => {
    const url = '/notification';
    return axios.get<IBackendRes<INotification[]>>(url);
};

// Mark notification as read - matches backend route: PATCH /notification/:notificationId/read
export const markNotificationAsReadAPI = (notificationId: string) => {
    const url = `/notification/${notificationId}/read`;
    return axios.patch<IBackendRes<INotification>>(url);
};

export const changePasswordAPI = (currentPassword: string, newPassword: string) => {
    const url = '/user/change-password';
    return axios.post(url, { currentPassword, newPassword });
};

// Helper function to transform IBookstore to IRestaurant format
const transformBookstoreToRestaurant = (bookstore: IBookstore): IRestaurant => {
    return {
        ...bookstore,
        menu: (bookstore.category || []).map((cat: ICategory) => ({
            _id: cat._id,
            bookstore: typeof cat.bookstore === 'string' ? cat.bookstore : cat.bookstore?._id || '',
            title: cat.name,
            name: cat.name,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
            menuItem: (cat.book || []).map((book: IBook) => ({
                _id: book._id,
                category: typeof book.category === 'string' ? book.category : book.category?._id || '',
                menu: typeof book.category === 'string' ? book.category : book.category?._id || '',
                title: book.title,
                author: book.author,
                description: book.description,
                basePrice: book.price,
                price: book.price,
                image: book.image,
                quantity: book.quantity,
                options: [],
                createdAt: book.createdAt,
                updatedAt: book.updatedAt,
            } as IMenuItem))
        } as IMenu)),
        isLike: bookstore.isLike || false
    } as IRestaurant;
};

// Backward compatibility - maps to bookstore endpoint and transforms results
export const getRestaurantByNameAPI = (name: string) => {
    const url = `/bookstore?current=1&pageSize=10&name=${name}`;
    return axios.get<IBackendRes<IModelPaginate<IBookstore>>>(url).then(response => {
        if (response.data?.data?.results) {
            return {
                ...response,
                data: {
                    ...response.data,
                    data: {
                        ...response.data.data,
                        results: response.data.data.results.map(transformBookstoreToRestaurant)
                    }
                }
            };
        }
        return response;
    });
  };

// Backward compatibility - maps to bookstore endpoint and transforms results
  export const filterRestaurantAPI = (query: string) => {
    const url = `/bookstore?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookstore>>>(url).then(response => {
        if (response.data?.data?.results) {
            return {
                ...response,
                data: {
                    ...response.data,
                    data: {
                        ...response.data.data,
                        results: response.data.data.results.map(transformBookstoreToRestaurant)
                    }
                }
            };
        }
        return response;
    });
  };

// Bookstore APIs
export const getTopBookStoreAPI = (ref: string) => {
    const url = `/bookstore/${ref}`;
    return axios.post<IBackendRes<ITopBookStore[]>>(url, {}, {
        headers: {delay: 3000}
    });
};

export const getBookStoreByIdAPI = (id: string) => {
    const url = `/bookstore/${id}`;
    return axios.get<IBackendRes<IBookstore>>(url, {
        headers: {delay: 3000}
    });
};

export const getBookStoreByNameAPI = (name: string) => {
    const url = `/bookstore?current=1&pageSize=10&name=${name}`;
    return axios.get<IBackendRes<IModelPaginate<IBookstore>>>(url);
};

export const filterBookStoreAPI = (query: string) => {
    const url = `/bookstore?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookstore>>>(url);
};

// Like bookstore - uses new toggleLikeAPI
export const likeBookStoreAPI = (bookstore: string, quantity?: number) => {
    // Backend doesn't use quantity, but we keep parameter for compatibility
    return toggleLikeAPI('bookstore', bookstore);
};

// Get favorite bookstores - uses new getLikedBookstoresAPI
export const getFavoriteBookStoreAPI = () => {
    return getLikedBookstoresAPI().then(response => {
        // Transform ILike[] to ILikeBookstore[] format
        if (response.data?.data) {
            return {
                ...response,
                data: {
                    ...response.data,
                    data: response.data.data
                        .filter(like => like.itemType === 'bookstore' && like.bookstore)
                        .map(like => ({
                            _id: like._id,
                            bookstore: like.bookstore!,
                            user: typeof like.user === 'string' ? like.user : like.user.id,
                            quantity: 1,
                            createdAt: like.createdAt,
                            updatedAt: like.updatedAt,
                        } as ILikeBookstore))
                }
            };
        }
        return response;
    });
};

// Unlike bookstore - uses toggleLikeAPI (toggle removes if exists)
export const deleteLikeBookStoreAPI = (bookstore: string) => {
    return toggleLikeAPI('bookstore', bookstore);
};

// Book APIs
export const getBooksByBookStoreAPI = (bookstoreId: string, page: number = 1, limit: number = 10) => {
    const url = `/book?bookstore=${bookstoreId}&page=${page}&limit=${limit}`;
    return axios.get<IBackendRes<IModelPaginate<IBook>>>(url);
};

export const getBookByIdAPI = (id: string) => {
    const url = `/book/${id}`;
    return axios.get<IBackendRes<IBook>>(url);
};

export const searchBooksAPI = (query: string, page: number = 1, limit: number = 10) => {
    const url = `/book?current=${page}&pageSize=${limit}&search=${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBook>>>(url);
};

export const getBooksByCategoryAPI = (categoryId: string, page: number = 1, limit: number = 10) => {
    const url = `/book?category=${categoryId}&current=${page}&pageSize=${limit}`;
    return axios.get<IBackendRes<IModelPaginate<IBook>>>(url);
};

// Category APIs
export const getAllCategoriesAPI = () => {
    const url = '/category';
    return axios.get<IBackendRes<ICategory[]>>(url);
};

export const getCategoryByIdAPI = (id: string) => {
    const url = `/category/${id}`;
    return axios.get<IBackendRes<ICategory>>(url);
};

// Review APIs - matches backend routes
// POST /review - Create or update review
export const createOrUpdateReviewAPI = (bookId: string, rating: number, comment?: string) => {
    const url = '/review';
    return axios.post<IBackendRes<IReview>>(url, { book: bookId, rating, comment });
};

// GET /review/:bookId - Get reviews for a book
export const getBookReviewsAPI = (bookId: string) => {
    const url = `/review/${bookId}`;
    return axios.get<IBackendRes<IReview[]>>(url);
};

// DELETE /review/:bookId - Delete review
export const deleteReviewAPI = (bookId: string) => {
    const url = `/review/${bookId}`;
    return axios.delete<IBackendRes<IReview>>(url);
};

// User APIs - matches backend routes
// PATCH /user/profile - Update user profile
export const updateUserProfileAPI = (name?: string, phone?: string, address?: string, photoUrl?: string) => {
    const url = '/user/profile';
    return axios.patch<IBackendRes<IUser>>(url, { name, phone, address, photoUrl });
};