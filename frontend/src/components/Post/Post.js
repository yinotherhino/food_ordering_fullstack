import React from 'react'
import fries from "../../assets/fries.svg"
import hamburger from "../../assets/hamburger.svg"
import pizza from "../../assets/pizza.svg"
import post from "../../assets/post.svg"
import "./Post.css"

const Post = () => {
  return (
    <div className='post'>
        <h3>Recent Post <span><img src={post} alt="" /></span></h3>
        <div>
            <img src={hamburger} alt="" />
            <img src={fries} alt="" />
            <img src={pizza} alt="" />
        </div>
    </div>
  )
}

export default Post
