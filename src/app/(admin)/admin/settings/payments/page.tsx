import PayOsCard from "./payos"
import VnPayCard from "./vnpay"

const PaymentPage = () => {

    return (
        <div className="m-10 space-y-20">
            <VnPayCard/>
            <PayOsCard/>
        </div>
    )
}

export default PaymentPage
