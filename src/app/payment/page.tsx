import PaymentClientPage from "@/features/client/payment/payment-client";

export async function generateMetadata() {
  return {
    title: "Thanh toán",
    description: "Trang thanh toán của cửa hàng thaifruiz",
  };
}

const PaymentPage = () => {
  return (
    <>
      {/* <AuroraBackground className="z-50"> */}
      <PaymentClientPage />
      {/* </AuroraBackground> */}
    </>
  );
};

export default PaymentPage;
