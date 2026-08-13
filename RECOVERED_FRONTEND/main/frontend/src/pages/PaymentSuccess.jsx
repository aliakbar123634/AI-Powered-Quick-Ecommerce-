import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPaymentDetail } from "../api/orderApi";

function PaymentSuccess() {

const [params] = useSearchParams();
const navigate = useNavigate();

const paymentId = params.get("payment_id");

const [payment,setPayment] = useState(null);


useEffect(()=>{

getPaymentDetail(paymentId)
.then(res=>{

setPayment(res.data);

});

},[]);


if(!payment){
return <h2>Loading...</h2>
}


return (

<div
style={{
minHeight:"80vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#f5f7fb"
}}
>


<div
style={{
width:"450px",
background:"white",
padding:"35px",
borderRadius:"20px",
boxShadow:"0 15px 40px rgba(0,0,0,0.15)",
textAlign:"center"
}}
>


<div
style={{
fontSize:"60px"
}}
>
✅
</div>


<h1
style={{
color:"#00b33c"
}}
>
Payment Successful
</h1>


<p>
Your order has been confirmed
</p>


<hr />


<div
style={{
textAlign:"left",
lineHeight:"35px"
}}
>


<p>
<b>Order:</b> #{payment.order}
</p>


<p>
<b>Amount:</b> Rs {payment.amount}
</p>


<p>
<b>Method:</b> {payment.payment_method}
</p>


<p>
<b>Status:</b>

<span
style={{
marginLeft:"10px",
background:"#d4ffd9",
color:"green",
padding:"5px 12px",
borderRadius:"20px"
}}
>

{payment.payment_status}

</span>

</p>


<p
style={{
fontSize:"13px",
wordBreak:"break-all"
}}
>

<b>Transaction:</b>
<br/>
{payment.transaction_id}

</p>


</div>


<button

onClick={()=>navigate("/orders")}

style={{
width:"100%",
padding:"14px",
background:"#00b33c",
color:"white",
border:"none",
borderRadius:"12px",
fontSize:"17px",
cursor:"pointer"
}}

>

View Orders

</button>


<button

onClick={()=>navigate("/")}

style={{
marginTop:"10px",
background:"none",
border:"none",
cursor:"pointer"
}}

>

Continue Shopping

</button>


</div>


</div>


)

}


export default PaymentSuccess;