import DashboardBoxes from "./components/DashboardBoxes";
import ProductsComponent from "./components/products";
import SalesAndUsersCharts from "./components/SalesAndUserCharts";
import UsersComponent from "./components/Users";

export default function Home() {
  return (
    <div className="p-5">
      <DashboardBoxes />
      
      <div className="py-2">
        <ProductsComponent />
      </div>

       
        <UsersComponent />

        <SalesAndUsersCharts />
      
    </div>
  );
}
