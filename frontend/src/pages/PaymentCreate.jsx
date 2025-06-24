import { useParams } from "react-router-dom"

function PaymentCreate() {
    const { bookingId } = useParams()
    return (
        <>
            <h1>Payment page for Booking id {bookingId}</h1>
        </>
    )
}

export default PaymentCreate
