import React, { useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';

 
import { getFirestore, collection, addDoc, doc, setDoc , getDoc,updateDoc, serverTimestamp, getDocs, initializeFirestore, query, onSnapshot} from 'firebase/firestore'; 
import 'firebase/analytics'; 


import {app} from '../../Firebase/Firebase.config';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import Timeline from '../../Components/Timeline/Timeline';

const db = getFirestore(app);
const currentDate = new Date();
const formattedDate = currentDate.toISOString();

const Home = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isTab , setTab] = useState("timeline");
    
   


    

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const ActiveTab = async (value) => {
        setTab(value)

}
    

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

  

    const handleTasksubmit = async() => {

        try {
            const docTaskRef = await addDoc(collection(db, "task"), {
                Title:  title,
                Description: description,
                Time: serverTimestamp(),
                CustomFormattedDate: formattedDate,
                Comment : [],

            });
            console.log("Task Document written with ID: ", docTaskRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }

    }

 
    
       
    


    const handleGetDtata = async()=>{
        
    }

   

    return (
        <div className='container mx-auto  w-full flex '>
            <div className='w-1/5 bg-slate-300 h-screen'>
                <h1 className='px-4 py-4 text-success text-center text-3xl'>Menu.</h1>
                <ul className=' py-3 px-8 text-xl text-red-800 '>
                    <li className={` ${isTab == "timeline" ? "border-green-500 text-red-500" : "" }  py-2  border-b-2 `} onClick={()=>ActiveTab("timeline")}>Your TimeLine</li>
                    <li className={` ${isTab == "task" ? "border-green-500 text-red-500" : "" }  py-2  border-b-2 `} onClick={()=>ActiveTab("task")}>Create Task</li>
                    <li className={` ${isTab == "profile" ? "border-green-500 text-red-500" : "" }  py-2  border-b-2 `} onClick={()=>ActiveTab("profile")}>Profile</li>
                </ul>
            </div>
            <div className='w-3/5'>
                { isTab =="profile" ? <div>
                    <h2>Profile.....</h2>
                </div> : isTab == "timeline" ? <div>
                    
                    <Timeline></Timeline>

                </div> : <div>
               <div className="bg-white p-4 rounded-lg ">
                <div className="relative bg-inherit">
                    <input
                        onChange={handleTitleChange}
                        type="text"
                        id="username"
                        name="username"
                        className="peer tracking-[1px] h-10 w-full rounded-lg  placeholder-transparent ring-2 px-2 ring-green-500 focus:ring-green-600 focus:outline-none focus:border-green-600"
                        placeholder="Type inside me"
                    />
                    <label
                        htmlFor="username"
                        className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                    >
                        Task Title
                    </label>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
                <div className="relative bg-inherit">
                    <textarea
                        onChange={handleDescriptionChange}
                        id="description"
                        name="description"
                        className="peer tracking-[1px] h-60 w-full rounded-lg placeholder-transparent ring-2 p-5 ring-green-500 focus:ring-green-600 focus:outline-none focus:border-green-800"
                        placeholder="Type inside me"
                    ></textarea>
                    <label
                        htmlFor="description"
                        className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                    >
                        Task Description..
                    </label>
                </div>
            </div>

            <button onClick={handleTasksubmit} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">
                Submit
            </button>


            <button onClick={handleGetDtata} className='btn btn-primary'>Get Data</button>
            <button  className='btn btn-success mt-6' >Get USERS</button>
               </div>}
               
            </div>
            <div className='w-1/5'> right side bar</div>
       

        
    </div>
    );
};

export default Home;