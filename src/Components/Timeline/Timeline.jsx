import React, { useContext, useEffect, useState } from 'react';
import { IoMdSend } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { getFirestore, collection, addDoc, doc, setDoc , getDoc,updateDoc, serverTimestamp, getDocs, deleteDoc, query, onSnapshot, arrayUnion} from 'firebase/firestore';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import {app} from '../../Firebase/Firebase.config';
import { MdDelete } from "react-icons/md";
import SweetAlert from '../sweetAlert/SweetAlert';
import Swal from 'sweetalert2'
import UpdataTask from '../UpdateTask/UpdataTask';


const db = getFirestore(app);
const currentDate = new Date();
const formattedDate = currentDate.toISOString();


const Timeline = () => {
    const { taskFromDB , dbUsers , user} = useContext(AuthContext);
    const [isComment , setComment]= useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [editedID, setEditedId] = useState();

    console.log(title,description,editedID);
    if (!taskFromDB && !user) {
        return <span className="loading loading-spinner loading-lg"></span>; 
    }

    const UpdateTask = async(id) => {
        const TargetedPost =  taskFromDB.find(data => {
            if(data.id == id){
              return data.data;
            }
         });
         setEditedId(TargetedPost.id);
         setTitle(TargetedPost.data.Title)
         setDescription(TargetedPost.data.Description)
         console.log(title, description)
           document.getElementById('my_modal_5').showModal();
       
    }

    const upDateATaskContent = async(id, updatedTitle, updatedDec)=>{
       console.log(id)
    
    
        const timestamp = serverTimestamp();
        const taskDatabase = doc(db, "task", `${id}`);

        const Newdata = {
            Title : updatedTitle,
            Description : updatedDec
        }
         try {
            
           await updateDoc(taskDatabase, Newdata);
            
             console.log("Post Updated successfully!");
         } catch (error) {
             console.error("Error updating comment:", error.message);
         }



    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }


    const handleCommentChange = (e)=>{
        setComment(e.target.value);
               
    }

   const  handleDeleteTask = async (taskid)=>{
        
        Swal.fire({
            title: "Do you want to delete the task?",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Delete",
          }).then( async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              const deletetask = await deleteDoc(doc(db, "task", `${taskid}`)); 
              console.log(deletetask);
              Swal.fire("Task have been deleted!", "", "success");
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          })
    }

    const handleUploadComment =async (id)=>{
        const timestamp = serverTimestamp();
        const newcomment = {
            usercomment : isComment,
            CommenterName : user?.displayName,
            CommenterEmail : user?.email
        }

     const taskDatabase = doc(db, "task", `${id}`);

        try {
            const taskDoc = await getDoc(taskDatabase);
            
          await updateDoc(taskDatabase, {
            Comment: arrayUnion(newcomment)
        });
            setComment('');
            console.log("Comment added successfully!");
        } catch (error) {
            console.error("Error updating comment:", error.message);
        }
    }



   

   
    
    return (
        <div>
            {taskFromDB?<>
               {taskFromDB.map(post =>  <div key={post.id} className='w-full p-3  my-2'>
                <div className='w-full flex flex-col border p-3'>
                <div className='flex mb-3 justify-between '>
                  <h2 className='text-3xl text-red-950 pr-2'>{post.data.Title}</h2>
                 <div className='flex gap-2 pl'>

                   <button onClick={()=>UpdateTask(post.id)} className='text-3xl text-green-500'><FaEdit /></button>
                   <button onClick={()=>handleDeleteTask(post.id)} className='text-3xl text-red-500'><MdDelete /></button>
                    </div></div>
                    <div className='h-40'>
                        {
                            post.data.Description
                        }
                    </div>
                    <div>assign task</div>
                    <div> 
                <h1 className='py-1 text-2xl mb-3'>Comment</h1>
                
                <div className='my-3'>

                {
                    post.data.Comment?.map(cmt => <> 
                       <span className='mb-1 text-lg text-primary'>{cmt.CommenterName? cmt.CommenterName : "Anonymous"}</span>
                       <p>{cmt.usercomment}</p>
                    </> )
                }

                </div>
                
                   
                
                <textarea onChange={handleCommentChange} id='comment' placeholder="write a comment" className="textarea textarea-bordered textarea-md w-full" ></textarea>
                <div className='text-right '>
                <button onClick={()=>handleUploadComment(post.id)}  className='px-3 btn text-xl py-2 text-green-500 border'><IoMdSend />send</button>
                </div>
            </div>
                </div>
                
                </div>)}
            </> : <h2>Create Your post...</h2> }




            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
              <div className="bg-white p-4 rounded-lg ">
                <div className="relative bg-inherit">
                    <input
                        onChange={handleTitleChange}
                        type="text"
                        id="username"
                        name="username"
                        className="peer tracking-[1px] h-10 w-full rounded-lg  placeholder-transparent ring-2 px-2 ring-green-500 focus:ring-green-600 focus:outline-none focus:border-green-600"
                        placeholder="Type inside me"
                        defaultValue={title}
                    >
                        
                    </input>
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
                        defaultValue={description}
                    >

                    </textarea>
                    <label
                        htmlFor="description"
                        className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                    >
                        Task Description..
                    </label>
                    
                </div>
            </div>
            <div className='modal-action'>
            <form method="dialog">
                <div>
                    <button onClick={()=>upDateATaskContent(editedID, title, description)} className="btn btn-success">Post</button>
                </div>
                </form>
            </div>

                
              </div>
            </dialog>
                        
        </div>
        
    );
};

export default Timeline;