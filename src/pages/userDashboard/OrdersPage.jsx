import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useOrders } from "../../hooks/useOrders";
import { updateOrderStatus } from "../../hooks/ordersStore";
import { getSavedUserInfo } from "../../utils/getUserInof";
// import StatsCard from "../../components/userDashboard/StatsCard";
// import OrderFilters from "../../components/userDashboard/OrderFilters";
// import OrdersTable from "../../components/userDashboard/OrdersTable";
import StatsCard from "../../components/userDashbaord/Statscard";
import OrderFilters from "../../components/userDashbaord/Orderfilters";
import OrdersTable from "../../components/userDashbaord/Orderstable";

const ROLE = "seller"; // "buyer" করলে My Orders পেজ হবে

const OrdersPage = () => {
    const userInfo = getSavedUserInfo();
    const userId = userInfo?.id;

    const [searchParams] = useSearchParams();

    // URL এর query params → hook এ পাঠানো হবে
    const params = useMemo(
        () => ({
            status: searchParams.get("status") || "all",
            date: searchParams.get("date") || "",
            from: searchParams.get("from") || "",
            to: searchParams.get("to") || "",
            sort: searchParams.get("sort") || "desc",
            page: Number(searchParams.get("page")) || 1,
        }),
        [searchParams]
    );

    const { data, isLoading, error } = useOrders(userId, ROLE, params);
    const { orders, total, totalPages, page, stats, counts } = data;

    return (
        <div className="w-full space-y-5 pb-12">
            <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Orders</h1>
                <p className="mt-1 text-xs text-gray-500">
                    View and manage orders placed for your store products.
                </p>
            </div>

            <StatsCard stats={stats} isLoading={isLoading} />

            <OrderFilters params={params} counts={counts} />

            <OrdersTable
                orders={orders}
                total={total}
                page={page}
                totalPages={totalPages}
                sort={params.sort}
                isLoading={isLoading}
                error={error}
                onStatusChange={updateOrderStatus}
            />
        </div>
    );
};

export default OrdersPage;