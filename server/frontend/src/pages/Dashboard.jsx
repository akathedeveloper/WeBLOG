import React, { useState,useContext,useEffect } from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../context/userContext'
import { useNavigate, useParams } from 'react-router-dom' 
import axios from 'axios'
import Loader from  '../components/Loader'
import DeletePost from './DeletePost'


const Dashboard = () => {
  const[posts,setPosts]=useState([])
  const[isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {id} = useParams()

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token

  //redirect to login page for any user who isn't logged in
  useEffect(() =>{
    if(!token){
      navigate('/login')
    }
  }, [])


  useEffect(()=>{
    const fetchPosts = async () =>{
      setIsLoading(true)
      try {
        const response = await axios.get(`${window.location.origin}/api/posts/users/${id}`,{withCredentials:true, headers:{Authorization: `Bearer ${token}`}})
        setPosts(response.data)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [id])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className="dashboard">
      {
        posts.length ? <div className="container dashboard__container">
          {
            posts.map(post=>{
              return <article key={post.id} className="dashboard__post">
                <div className="dashboard__post-info">
                  <div className="dashboard__post-thumbnail">
                    <img src={`$${window.location.origin}/uploads/${post.thumbnail}`} alt=""/>
                  </div>
                 <h5>{post.title}</h5> 
                </div>
                <div className="dashboard__post-actions">
                  <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                  <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                  <DeletePost postId={post._id}/>
                </div>
              </article>
            })
          }
        </div> : <h2 className='center'>You have no posts yet.</h2>
      }
    </section>
  )
}

export default Dashboard