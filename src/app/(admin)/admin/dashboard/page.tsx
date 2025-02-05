import { DataTable } from "@/components/global-components/data-table/data-table";
import { Payment, columns } from "@/features/admin/dashboard/column";

//* this data will be fetched from the server, for now, we will use this dummy data
//* you can replace this with your own data
const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

const DashboardPage = () => {
  return (
    <div className="p-4">
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default DashboardPage;
