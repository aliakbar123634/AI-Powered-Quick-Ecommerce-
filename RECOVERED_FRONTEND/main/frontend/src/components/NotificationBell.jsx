
import React, {
    useEffect,
    useState,
    useRef
} from "react";


import {
    Bell,
    CheckCheck,
    X
} from "lucide-react";


import {
    getNotifications,
    markNotificationRead
} from "../api/notificationApi";




const NotificationBell = () => {


const [notifications,setNotifications] = useState([]);

const [open,setOpen] = useState(false);


const dropdownRef = useRef(null);





// fetch notifications

useEffect(()=>{

fetchNotifications();

},[]);





// outside click close

useEffect(()=>{


const handleClickOutside = (event)=>{


if(

dropdownRef.current &&

!dropdownRef.current.contains(event.target)

){

setOpen(false);

}


};




document.addEventListener(

"mousedown",

handleClickOutside

);




return ()=>{


document.removeEventListener(

"mousedown",

handleClickOutside

);


};



},[]);









const fetchNotifications = async()=>{


try{


const response = await getNotifications();



setNotifications(

response.data.results

);



}catch(error){


console.log(error);


}


};










const unreadCount = notifications.filter(

item => item.is_read === false

).length;










const handleRead = async(id)=>{


try{


await markNotificationRead(id);



setNotifications(


notifications.map(item =>


item.id === id


?


{

...item,

is_read:true

}


:


item



)



);




}catch(error){


console.log(error);


}



};










const markAllRead = async()=>{



try{


notifications.forEach(item=>{


if(!item.is_read){


markNotificationRead(item.id);


}


});





setNotifications(


notifications.map(item=>(


{

...item,

is_read:true


}


))


);




}catch(error){


console.log(error);


}



};









return (



<div

className="relative"

ref={dropdownRef}

>




{/* Bell */}


<button


onClick={()=>setOpen(!open)}


className="
relative
hover:text-green-400
transition
"


>



<Bell size={28}/>





{

unreadCount > 0 &&



<span

className="
absolute
-top-2
-right-2
bg-red-600
text-white
text-xs
w-5
h-5
rounded-full
flex
items-center
justify-center
"

>


{unreadCount}


</span>



}




</button>











{/* Dropdown */}



{


open &&




<div


className="
absolute
right-0
mt-5
w-96
bg-[#0F172A]
text-white
rounded-2xl
shadow-2xl
p-5
z-50
animate-fadeIn
border
border-gray-700
"


>







{/* Header */}


<div className="flex justify-between items-center mb-4">


<h2 className="font-bold text-lg">


Notifications 🔔


</h2>





<div className="flex items-center gap-3">



{


unreadCount > 0 &&



<button


onClick={markAllRead}


className="
flex
items-center
gap-1
text-sm
text-green-400
hover:text-green-300
"


>



<CheckCheck size={16}/>



Mark all



</button>



}







<button


onClick={()=>setOpen(false)}


className="
hover:bg-gray-700
p-2
rounded-full
transition
"


>


<X size={20}/>


</button>




</div>




</div>









{/* Notification list */}



<div className="max-h-96 overflow-y-auto">



{


notifications.length > 0



?



notifications.map(item=>(





<div


key={item.id}


onClick={()=>handleRead(item.id)}


className={`

p-4
rounded-xl
mb-3
cursor-pointer
transition


${

item.is_read

?

"bg-gray-800"

:

"bg-green-900/40 border border-green-500"


}

`}


>





<div className="flex justify-between">



<h3 className="font-semibold">


{item.title}


</h3>





{


!item.is_read &&



<span

className="
w-2
h-2
bg-green-400
rounded-full
"

>

</span>



}




</div>








<p className="text-sm text-gray-300 mt-1">


{item.message}


</p>






<p className="text-xs text-gray-500 mt-2">


{

new Date(

item.created_at

).toLocaleString()


}


</p>





</div>





))





:




<div className="text-center py-10 text-gray-400">


No notifications yet


</div>



}




</div>





</div>




}




</div>




);



};




export default NotificationBell;