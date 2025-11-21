
import { useCurrentApp } from "@/context/app.context";
import { router } from "expo-router";
import React from "react";
import ItemSingle from "./item.single";

interface IProps {
    menuItem: IMenuItem;
    restaurant: IRestaurant | null;
    isModal: boolean;
}

const ItemQuantity = (props: IProps) => {
    const { menuItem, restaurant, isModal } = props;
    const { cart, setCart } = useCurrentApp();

    const handlePressItem = (item: IMenuItem, action: "MINUS" | "PLUS") => {

        if (item.options && item.options.length > 0 && isModal === false) {
            router.navigate({
                pathname: action === "PLUS" ? "/product/create.modal" : "/product/update.modal",
                params: { menuItemId: menuItem._id }
            })
        } else {

            if (restaurant?._id) {
                const total = action === "MINUS" ? -1 : 1;
                if (!cart[restaurant?._id]) {
                    //chưa tồn tại nhà sách => khởi tạo nhà sách
                    cart[restaurant._id] = {
                        sum: 0,
                        quantity: 0,
                        items: {}
                    }
                }

                //xử lý sản phẩm
                const itemPrice = item.basePrice || item.price || 0;
                cart[restaurant._id].sum = cart[restaurant._id].sum + total * itemPrice;
                cart[restaurant._id].quantity = cart[restaurant._id].quantity + total;

                //check sản phẩm đã từng thêm vào chưa
                if (!cart[restaurant._id].items[item._id]) {
                    cart[restaurant._id].items[item._id] = {
                        data: menuItem,
                        quantity: 0
                    };
                }

                const currentQuantity = cart[restaurant._id].items[item._id].quantity + total;
                cart[restaurant._id].items[item._id] = {
                    data: menuItem,
                    quantity: currentQuantity
                };

                if (currentQuantity <= 0) {
                    delete cart[restaurant._id].items[item._id];
                }
                setCart((prevState: any) => ({ ...prevState, ...cart }))

            }

        }
    }

    let showMinus = false;
    let quantity = 0;
    if (restaurant?._id) {
        const store = cart[restaurant?._id!];
        if (store?.items && store?.items[menuItem?._id]) {
            showMinus = true;
            quantity = store?.items[menuItem?._id].quantity;
        }
    }

    return (
        <ItemSingle
            menuItem={menuItem}
            handlePressItem={handlePressItem}
            showMinus={showMinus}
            quantity={quantity}
        />
    )
}

export default ItemQuantity;